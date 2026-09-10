/**
 * ESPO Paris website CMS storage bridge.
 *
 * Deploy as a Google Apps Script Web App owned by an institution account.
 * Script properties required:
 *   CMS_API_SECRET        >= 32 characters
 *   CMS_SPREADSHEET_ID    spreadsheet created by provisionCmsWorkspace()
 *
 * The browser never calls this Web App directly. Requests come from the
 * Next.js server and are HMAC signed. Role checks are repeated here.
 */

var CMS_CONTENT_SHEET = 'CMS Content';
var CMS_REFLECTIONS_SHEET = 'CMS Reflections';
var CMS_AUDIT_SHEET = 'CMS Audit Log';

var CMS_CONTENT_HEADERS = [
  'Id','Kind','Title','Slug','Excerpt','Body','CoverImage','Status','PublishAt','UnpublishAt','Priority','AuthorEmail','UpdatedAt'
];
var CMS_REFLECTION_HEADERS = [
  'Id','Kind','ArabicText','SourceLabel','TranslationEn','TranslationFr','TranslationAr','TranslationFa','OccasionLabel','ActiveFrom','ActiveUntil','Priority','Approved','UpdatedAt','UpdatedBy'
];
var CMS_AUDIT_HEADERS = ['Timestamp','ActorEmail','ActorRole','Action','EntityType','EntityId','DetailsJson'];

function provisionCmsWorkspace() {
  var ss = SpreadsheetApp.create('ESPO Paris - Website CMS');
  ensureCmsSheet_(ss, CMS_CONTENT_SHEET, CMS_CONTENT_HEADERS);
  ensureCmsSheet_(ss, CMS_REFLECTIONS_SHEET, CMS_REFLECTION_HEADERS);
  ensureCmsSheet_(ss, CMS_AUDIT_SHEET, CMS_AUDIT_HEADERS);
  PropertiesService.getScriptProperties().setProperty('CMS_SPREADSHEET_ID', ss.getId());
  return { spreadsheetId: ss.getId(), url: ss.getUrl() };
}

function ensureCmsSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var current = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (current[i] !== headers[i]) throw new Error('CMS schema mismatch in ' + name + ' at column ' + (i + 1) + '.');
  }
  sheet.setFrozenRows(1);
  return sheet;
}

function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    validateCmsRequest_(body);
    var action = String(body.action || '');
    var data = body.data || {};
    var actor = body.actor || {};
    var result;

    if (action === 'health') result = { ok: true, service: 'espo-cms' };
    else if (action === 'cms.admin.snapshot') { assertCmsCapability_(actor, 'view'); result = cmsAdminSnapshot_(); }
    else if (action === 'cms.item.save') { assertCmsCapability_(actor, 'edit'); result = saveCmsItem_(data.item, actor); }
    else if (action === 'cms.item.transition') { result = transitionCmsItem_(data, actor); }
    else if (action === 'cms.item.delete') { assertCmsCapability_(actor, 'delete'); result = deleteCmsItem_(data.id, actor); }
    else if (action === 'cms.reflection.save') { assertCmsCapability_(actor, 'reflection'); result = saveCmsReflection_(data.reflection, actor); }
    else if (action === 'cms.reflection.delete') { assertCmsCapability_(actor, 'delete'); result = deleteCmsReflection_(data.id, actor); }
    else if (action === 'cms.public.snapshot') result = cmsPublicSnapshot_(data);
    else throw new Error('Unsupported CMS action: ' + action);

    return cmsJsonResponse_({ ok: true, result: result });
  } catch (error) {
    return cmsJsonResponse_({ ok: false, error: error.message });
  }
}

function cmsSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('CMS_SPREADSHEET_ID');
  if (!id) throw new Error('CMS_SPREADSHEET_ID is not configured. Run provisionCmsWorkspace() once.');
  return SpreadsheetApp.openById(id);
}

function cmsSheet_(name, headers) {
  return ensureCmsSheet_(cmsSpreadsheet_(), name, headers);
}

function validateCmsRequest_(body) {
  var secret = PropertiesService.getScriptProperties().getProperty('CMS_API_SECRET');
  if (!secret || secret.length < 32) throw new Error('CMS_API_SECRET is not configured.');
  if (!body || !body.action || !body.issuedAt || !body.nonce || !body.signature) throw new Error('Malformed CMS request.');
  var issued = new Date(body.issuedAt).getTime();
  if (!issued || Math.abs(Date.now() - issued) > 5 * 60 * 1000) throw new Error('Expired CMS request.');
  var cache = CacheService.getScriptCache();
  var nonceKey = 'cms-nonce:' + String(body.nonce);
  if (cache.get(nonceKey)) throw new Error('Replay detected.');
  var unsigned = { action: body.action, issuedAt: body.issuedAt, nonce: body.nonce, data: body.data, actor: body.actor || null };
  var expected = cmsHmacHex_(cmsCanonicalJson_(unsigned), secret);
  if (!cmsConstantTimeEquals_(expected, String(body.signature))) throw new Error('Invalid CMS signature.');
  cache.put(nonceKey, '1', 300);
}

function assertCmsCapability_(actor, capability) {
  var role = String((actor && actor.role) || '');
  var email = normalizeCmsEmail_((actor && actor.email) || '');
  if (!email) throw new Error('Authenticated CMS actor is required.');
  var allowed = {
    view: ['editor','academic-officer','admin'],
    edit: ['editor','admin'],
    schedule: ['editor','admin'],
    publish: ['admin'],
    delete: ['admin'],
    reflection: ['editor','admin']
  };
  if (!allowed[capability] || allowed[capability].indexOf(role) < 0) throw new Error('CMS capability denied: ' + capability + '.');
}

function cmsAdminSnapshot_() {
  return { items: readCmsItems_(), reflections: readCmsReflections_() };
}

function readCmsItems_() {
  var sheet = cmsSheet_(CMS_CONTENT_SHEET, CMS_CONTENT_HEADERS);
  if (sheet.getLastRow() <= 1) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, CMS_CONTENT_HEADERS.length).getDisplayValues().filter(function(r){ return Boolean(r[0]); }).map(cmsItemFromRow_);
}

function cmsItemFromRow_(r) {
  var schedule = {};
  if (r[8]) schedule.publishAt = r[8];
  if (r[9]) schedule.unpublishAt = r[9];
  if (r[10] !== '') schedule.priority = Number(r[10]);
  return {
    id:r[0], kind:r[1], title:r[2], slug:r[3], excerpt:r[4] || undefined, body:r[5] || undefined,
    coverImage:r[6] || undefined, status:r[7], schedule:Object.keys(schedule).length ? schedule : undefined,
    authorEmail:r[11], updatedAt:r[12]
  };
}

function cmsItemRow_(item) {
  var schedule = item.schedule || {};
  return [item.id,item.kind,item.title,item.slug,item.excerpt || '',item.body || '',item.coverImage || '',item.status,schedule.publishAt || '',schedule.unpublishAt || '',schedule.priority == null ? '' : schedule.priority,item.authorEmail,item.updatedAt];
}

function findCmsRowById_(sheet, id) {
  if (sheet.getLastRow() <= 1) return -1;
  var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues();
  for (var i=0;i<ids.length;i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function validateCmsItem_(item) {
  if (!item || !String(item.id || '').trim()) throw new Error('CMS item id is required.');
  if (['news','activity','announcement'].indexOf(String(item.kind)) < 0) throw new Error('Invalid CMS content kind.');
  if (!String(item.title || '').trim()) throw new Error('CMS title is required.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(item.slug || ''))) throw new Error('CMS slug is invalid.');
  if (['draft','review','scheduled','published','archived'].indexOf(String(item.status)) < 0) throw new Error('Invalid CMS status.');
  if (item.status === 'scheduled' && !(item.schedule && item.schedule.publishAt)) throw new Error('Scheduled content requires publishAt.');
}

function saveCmsItem_(item, actor) {
  validateCmsItem_(item);
  if (String(item.status) === 'published') assertCmsCapability_(actor, 'publish');
  if (String(item.status) === 'scheduled') assertCmsCapability_(actor, 'schedule');
  var now = new Date().toISOString();
  item.updatedAt = now;
  item.authorEmail = item.authorEmail || normalizeCmsEmail_(actor.email);
  var sheet = cmsSheet_(CMS_CONTENT_SHEET, CMS_CONTENT_HEADERS);
  var row = findCmsRowById_(sheet, item.id);
  if (row < 0) sheet.appendRow(cmsItemRow_(item)); else sheet.getRange(row, 1, 1, CMS_CONTENT_HEADERS.length).setValues([cmsItemRow_(item)]);
  cmsAudit_(actor, 'item.save', 'content', item.id, { status:item.status, slug:item.slug });
  return cmsItemFromRow_(cmsItemRow_(item).map(String));
}

function transitionCmsItem_(data, actor) {
  var sheet = cmsSheet_(CMS_CONTENT_SHEET, CMS_CONTENT_HEADERS);
  var row = findCmsRowById_(sheet, data.id);
  if (row < 0) throw new Error('CMS item not found.');
  var current = cmsItemFromRow_(sheet.getRange(row, 1, 1, CMS_CONTENT_HEADERS.length).getDisplayValues()[0]);
  var target = String(data.status || '');
  var allowed = {
    draft:['review','archived'], review:['draft','scheduled','published','archived'], scheduled:['draft','review','published','archived'], published:['archived'], archived:['draft']
  };
  if (!allowed[current.status] || allowed[current.status].indexOf(target) < 0) throw new Error('Invalid CMS status transition.');
  if (target === 'published') assertCmsCapability_(actor, 'publish'); else if (target === 'scheduled') assertCmsCapability_(actor, 'schedule'); else assertCmsCapability_(actor, 'edit');
  if (target === 'scheduled' && !(current.schedule && current.schedule.publishAt)) throw new Error('Scheduled content requires publishAt.');
  var previousStatus = current.status;
  current.status = target;
  current.updatedAt = new Date().toISOString();
  sheet.getRange(row, 1, 1, CMS_CONTENT_HEADERS.length).setValues([cmsItemRow_(current)]);
  cmsAudit_(actor, 'item.transition', 'content', current.id, { from:previousStatus, to:target });
  return current;
}

function deleteCmsItem_(id, actor) {
  var sheet = cmsSheet_(CMS_CONTENT_SHEET, CMS_CONTENT_HEADERS);
  var row = findCmsRowById_(sheet, id);
  if (row < 0) throw new Error('CMS item not found.');
  sheet.deleteRow(row);
  cmsAudit_(actor, 'item.delete', 'content', id, {});
  return { id:id, deleted:true };
}

function readCmsReflections_() {
  var sheet = cmsSheet_(CMS_REFLECTIONS_SHEET, CMS_REFLECTION_HEADERS);
  if (sheet.getLastRow() <= 1) return [];
  return sheet.getRange(2,1,sheet.getLastRow()-1,CMS_REFLECTION_HEADERS.length).getDisplayValues().filter(function(r){return Boolean(r[0]);}).map(function(r){
    var translations = {};
    if (r[4]) translations.en = r[4]; if (r[5]) translations.fr = r[5]; if (r[6]) translations.ar = r[6]; if (r[7]) translations.fa = r[7];
    return { id:r[0], kind:r[1], arabicText:r[2], sourceLabel:r[3], translations:translations, occasionLabel:r[8] || undefined, activeFrom:r[9] || undefined, activeUntil:r[10] || undefined, priority:Number(r[11] || 0), approved:String(r[12]).toLowerCase()==='true' };
  });
}

function reflectionRow_(r, actor) {
  var t = r.translations || {};
  return [r.id,r.kind,r.arabicText,r.sourceLabel,t.en || '',t.fr || '',t.ar || '',t.fa || '',r.occasionLabel || '',r.activeFrom || '',r.activeUntil || '',r.priority || 0,Boolean(r.approved),new Date().toISOString(),normalizeCmsEmail_(actor.email)];
}

function validateReflection_(r) {
  if (!r || !String(r.id || '').trim()) throw new Error('Reflection id is required.');
  if (['quran','hadith'].indexOf(String(r.kind)) < 0) throw new Error('Invalid reflection kind.');
  if (!String(r.arabicText || '').trim()) throw new Error('Arabic reflection text is required.');
  if (!String(r.sourceLabel || '').trim()) throw new Error('Source attribution is required.');
}

function saveCmsReflection_(r, actor) {
  validateReflection_(r);
  // Approval is a publishing-equivalent action and remains master-admin only.
  if (r.approved) assertCmsCapability_(actor, 'publish');
  var sheet = cmsSheet_(CMS_REFLECTIONS_SHEET, CMS_REFLECTION_HEADERS);
  var row = findCmsRowById_(sheet, r.id);
  var values = reflectionRow_(r, actor);
  if (row < 0) sheet.appendRow(values); else sheet.getRange(row,1,1,CMS_REFLECTION_HEADERS.length).setValues([values]);
  cmsAudit_(actor, 'reflection.save', 'reflection', r.id, { approved:Boolean(r.approved), kind:r.kind });
  return r;
}

function deleteCmsReflection_(id, actor) {
  var sheet = cmsSheet_(CMS_REFLECTIONS_SHEET, CMS_REFLECTION_HEADERS);
  var row = findCmsRowById_(sheet, id);
  if (row < 0) throw new Error('Reflection not found.');
  sheet.deleteRow(row);
  cmsAudit_(actor, 'reflection.delete', 'reflection', id, {});
  return { id:id, deleted:true };
}

function cmsPublicSnapshot_(data) {
  var now = data && data.at ? new Date(data.at) : new Date();
  var ts = now.getTime();
  var items = readCmsItems_().filter(function(item){
    if (item.status !== 'published') return false;
    var schedule = item.schedule || {};
    var start = schedule.publishAt ? new Date(schedule.publishAt).getTime() : -Infinity;
    var end = schedule.unpublishAt ? new Date(schedule.unpublishAt).getTime() : Infinity;
    return ts >= start && ts <= end;
  });
  var reflections = readCmsReflections_().filter(function(r){
    if (!r.approved) return false;
    var start = r.activeFrom ? new Date(r.activeFrom).getTime() : -Infinity;
    var end = r.activeUntil ? new Date(r.activeUntil).getTime() : Infinity;
    return ts >= start && ts <= end;
  });
  return { items:items, reflections:reflections };
}

function cmsAudit_(actor, action, entityType, entityId, details) {
  var sheet = cmsSheet_(CMS_AUDIT_SHEET, CMS_AUDIT_HEADERS);
  sheet.appendRow([new Date().toISOString(), normalizeCmsEmail_(actor.email), String(actor.role || ''), action, entityType, entityId, JSON.stringify(details || {})]);
}

function cmsJsonResponse_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function normalizeCmsEmail_(value) { return String(value || '').trim().toLowerCase(); }
function cmsCanonicalJson_(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(cmsCanonicalJson_).join(',') + ']';
  var keys = Object.keys(value).sort();
  return '{' + keys.map(function(k){ return JSON.stringify(k) + ':' + cmsCanonicalJson_(value[k]); }).join(',') + '}';
}
function cmsHmacHex_(message, secret) {
  var bytes = Utilities.computeHmacSha256Signature(message, secret);
  return bytes.map(function(byte){ var v=(byte<0?byte+256:byte).toString(16); return v.length===1?'0'+v:v; }).join('');
}
function cmsConstantTimeEquals_(a,b) { if (a.length !== b.length) return false; var diff=0; for(var i=0;i<a.length;i++) diff |= a.charCodeAt(i)^b.charCodeAt(i); return diff===0; }
