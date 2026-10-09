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
var CMS_INQUIRIES_SHEET = 'CMS Contact Inbox';
var CMS_INQUIRY_HEADERS = ['Id','ReceivedAt','Locale','Name','Email','Reason','Subject','Message'];
var CMS_SETTINGS_SHEET = 'CMS Settings';
var CMS_SETTINGS_HEADERS = ['Key','Value'];

var CMS_CONTENT_HEADERS = [
  'Id','Kind','Title','Slug','Excerpt','Body','CoverImage','Status','PublishAt','UnpublishAt','Priority','AuthorEmail','UpdatedAt'
];
var CMS_REFLECTION_HEADERS = [
  'Id','Kind','ArabicText','SourceLabel','TranslationEn','TranslationFr','TranslationAr','TranslationFa','OccasionLabel','ActiveFrom','ActiveUntil','Priority','Approved','UpdatedAt','UpdatedBy'
];
var CMS_AUDIT_HEADERS = ['Timestamp','ActorEmail','ActorRole','Action','EntityType','EntityId','DetailsJson'];

function provisionCmsWorkspace() {
  var existingId = PropertiesService.getScriptProperties().getProperty('CMS_SPREADSHEET_ID');
  var ss = existingId ? SpreadsheetApp.openById(existingId) : SpreadsheetApp.create('ESPO Paris - Website CMS');
  ensureCmsSheet_(ss, CMS_CONTENT_SHEET, CMS_CONTENT_HEADERS);
  ensureCmsSheet_(ss, CMS_REFLECTIONS_SHEET, CMS_REFLECTION_HEADERS);
  ensureCmsSheet_(ss, CMS_AUDIT_SHEET, CMS_AUDIT_HEADERS);
  ensureCmsSheet_(ss, CMS_INQUIRIES_SHEET, CMS_INQUIRY_HEADERS);
  ensureCmsSheet_(ss, CMS_SETTINGS_SHEET, CMS_SETTINGS_HEADERS);
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
    else if (action === 'cms.inquiry.create') result = createCmsInquiry_(data);
    else if (action === 'cms.inquiries.list') { assertCmsCapability_(actor, 'inbox'); result = listCmsInquiries_(); }
    else if (action === 'cms.donation.save') { assertCmsCapability_(actor, 'publish'); result = saveCmsDonation_(data.settings); }
    else if (action === 'cms.item.save') { assertCmsCapability_(actor, 'edit'); result = saveCmsItem_(data.item, actor); }
    else if (action === 'cms.item.transition') { result = transitionCmsItem_(data, actor); }
    else if (action === 'cms.item.delete') { assertCmsCapability_(actor, 'delete'); result = deleteCmsItem_(data.id, actor); }
    else if (action === 'cms.reflection.save') { assertCmsCapability_(actor, 'reflection'); result = saveCmsReflection_(data.reflection, actor); }
    else if (action === 'cms.reflection.delete') { assertCmsCapability_(actor, 'delete'); result = deleteCmsReflection_(data.id, actor); }
    else if (action === 'cms.institute.save') { assertCmsCapability_(actor, 'edit'); result = saveCmsInstitute_(data.institute, actor); }
    else if (action === 'cms.institute.delete') { assertCmsCapability_(actor, 'delete'); result = deleteCmsInstitute_(data, actor); }
    else if (action === 'cms.profile.save') { assertCmsCapability_(actor, 'edit'); result = saveCmsProfile_(data.profile, actor); }
    else if (action === 'cms.media.upload') { assertCmsCapability_(actor, 'edit'); result = uploadCmsImage_(data, actor); }
    else if (action === 'cms.media.read') { result = readCmsImage_(data.id, actor); }
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
    reflection: ['editor','admin'],
    inbox: ['admin']
  };
  if (!allowed[capability] || allowed[capability].indexOf(role) < 0) throw new Error('CMS capability denied: ' + capability + '.');
}

function createCmsInquiry_(data) {
  var name = String(data.name || '').trim(), email = String(data.email || '').trim();
  var subject = String(data.subject || '').trim(), message = String(data.message || '').trim();
  var locale = String(data.locale || ''), reason = String(data.reason || '');
  if (name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 ||
      subject.length < 2 || subject.length > 200 || message.length < 20 || message.length > 5000 ||
      ['en','fr','ar','fa'].indexOf(locale) < 0 || ['general','partnerships','visit'].indexOf(reason) < 0) {
    throw new Error('Invalid contact inquiry.');
  }
  var id = Utilities.getUuid();
  // Prevent user-supplied text from becoming a spreadsheet formula.
  function cell(value) { return /^[=+\-@]/.test(value) ? "'" + value : value; }
  cmsSheet_(CMS_INQUIRIES_SHEET, CMS_INQUIRY_HEADERS).appendRow([id,new Date().toISOString(),locale,cell(name),cell(email),reason,cell(subject),cell(message)]);
  return { id:id };
}

function listCmsInquiries_() {
  var sheet = cmsSheet_(CMS_INQUIRIES_SHEET, CMS_INQUIRY_HEADERS);
  if (sheet.getLastRow() <= 1) return [];
  return sheet.getRange(2,1,sheet.getLastRow()-1,CMS_INQUIRY_HEADERS.length).getDisplayValues().map(function(r){
    return {id:r[0],receivedAt:r[1],locale:r[2],name:r[3],email:r[4],reason:r[5],subject:r[6],message:r[7]};
  }).reverse().slice(0, 200);
}

function cmsAdminSnapshot_() {
  return { items: readCmsItems_(), reflections: readCmsReflections_(), institutes: readCmsInstitutes_(), profiles: readCmsProfiles_(), donation: readCmsDonation_() };
}

function readCmsDonation_() {
  var sheet = cmsSheet_(CMS_SETTINGS_SHEET, CMS_SETTINGS_HEADERS);
  var row = findCmsRowById_(sheet, 'donation');
  if (row < 0) return { enabled:false, paypalUrl:'' };
  try { return JSON.parse(sheet.getRange(row,2).getValue()); }
  catch (error) { return { enabled:false, paypalUrl:'' }; }
}

function validCmsDonationUrl_(value) {
  return /^https:\/\/(?:www\.)?paypal\.com\/donate\/?\?hosted_button_id=[A-Za-z0-9]+$/.test(String(value || ''));
}

function saveCmsDonation_(settings) {
  if (!settings || typeof settings.enabled !== 'boolean' || typeof settings.paypalUrl !== 'string' ||
      (settings.enabled && !validCmsDonationUrl_(settings.paypalUrl))) throw new Error('Invalid donation settings.');
  var value = { enabled:settings.enabled, paypalUrl:settings.paypalUrl.trim() };
  var sheet = cmsSheet_(CMS_SETTINGS_SHEET, CMS_SETTINGS_HEADERS), row = findCmsRowById_(sheet, 'donation');
  if (row < 0) sheet.appendRow(['donation',JSON.stringify(value)]);
  else sheet.getRange(row,2).setValue(JSON.stringify(value));
  return value;
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
  var existing = readCmsItems_().filter(function(x){ return x.id === item.id; })[0];
  if (existing && existing.status === 'published') assertCmsCapability_(actor, 'publish');
  if (item.coverImage && !/^\/api\/content-media\/[A-Za-z0-9_-]{10,}$/.test(item.coverImage) && !/^\/(faculty|images)\/[A-Za-z0-9_./-]+\.(jpg|jpeg|png|webp)$/i.test(item.coverImage)) throw new Error('Invalid image reference.');
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
  if (['quran','hadith','wisdom'].indexOf(String(r.kind)) < 0) throw new Error('Invalid reflection kind.');
  if (!String(r.arabicText || '').trim()) throw new Error('Arabic reflection text is required.');
  if (!String(r.sourceLabel || '').trim()) throw new Error('Source attribution is required.');
}

function saveCmsReflection_(r, actor) {
  validateReflection_(r);
  var existing = readCmsReflections_().filter(function(x){ return x.id === r.id; })[0];
  if (existing && existing.approved) assertCmsCapability_(actor, 'publish');
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
  var donation = readCmsDonation_();
  return { items:items, reflections:reflections, institutes:readCmsInstitutes_().filter(function(x){return x.approved;}), profiles:readCmsProfiles_().filter(function(p){return p.approved;}), donation: donation.enabled && validCmsDonationUrl_(donation.paypalUrl) ? donation : undefined };
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


// Private image storage; only referenced, visible content is served publicly.
function cmsMediaFolder_() {
  var properties = PropertiesService.getScriptProperties();
  var id = properties.getProperty('CMS_MEDIA_FOLDER_ID');
  if (!id) throw new Error('Run provisionCmsMedia() once.');
  return DriveApp.getFolderById(id);
}
function provisionCmsMedia() {
  var properties = PropertiesService.getScriptProperties();
  var id = properties.getProperty('CMS_MEDIA_FOLDER_ID');
  if (id) return { folderId:id };
  var folder = DriveApp.createFolder('ESPO Paris - Website Media');
  properties.setProperty('CMS_MEDIA_FOLDER_ID', folder.getId());
  return { folderId:folder.getId() };
}
function uploadCmsImage_(data, actor) {
  if (!data.base64 || data.base64.length > 1400000) throw new Error('Image too large.');
  var bytes = Utilities.base64Decode(data.base64);
  if (!bytes.length || bytes.length > 1048576) throw new Error('Image too large.');
  var b = bytes.map(function(v){return (v+256)%256;});
  var valid = (data.mime === 'image/jpeg' && b[0] === 255 && b[1] === 216 && b[2] === 255) ||
    (data.mime === 'image/png' && b.slice(0,8).join(',') === '137,80,78,71,13,10,26,10') ||
    (data.mime === 'image/webp' && String.fromCharCode.apply(null,b.slice(0,4)) === 'RIFF' && String.fromCharCode.apply(null,b.slice(8,12)) === 'WEBP');
  if (!valid) throw new Error('Invalid image.');
  var file = cmsMediaFolder_().createFile(Utilities.newBlob(bytes, data.mime, String(data.name || 'image').slice(0,120)));
  cmsAudit_(actor, 'media.upload', 'media', file.getId(), { mime:data.mime });
  return { id:file.getId() };
}
function readCmsImage_(id, actor) {
  if (!/^[A-Za-z0-9_-]{10,}$/.test(String(id))) throw new Error('Invalid image.');
  if (actor && actor.email) assertCmsCapability_(actor, 'edit');
  else {
    var ref = '/api/content-media/' + id;
    var snapshot = cmsPublicSnapshot_({});
    var referenced = snapshot.items.some(function(item){return item.coverImage === ref;}) || snapshot.profiles.some(function(p){return p.image === ref;});
    if (!referenced) throw new Error('Image not published.');
  }
  var file = DriveApp.getFileById(id), parents = file.getParents(), allowed = false;
  var folderId = cmsMediaFolder_().getId();
  while (parents.hasNext()) if (parents.next().getId() === folderId) allowed = true;
  if (!allowed || file.isTrashed() || file.getSize() > 1048576) throw new Error('Image unavailable.');
  return { mime:file.getMimeType(), base64:Utilities.base64Encode(file.getBlob().getBytes()) };
}


var CMS_PROFILE_HEADERS = ['Key','ProfileJson'];
function readCmsProfiles_() {
  var sheet = cmsSheet_('CMS Faculty', CMS_PROFILE_HEADERS);
  if (sheet.getLastRow() <= 1) return [];
  return sheet.getRange(2,1,sheet.getLastRow()-1,2).getDisplayValues().filter(function(r){return r[0];}).map(function(r){return JSON.parse(r[1]);});
}
function saveCmsProfile_(profile, actor) {
  if (!profile || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.id) || ['en','fr','ar','fa'].indexOf(profile.locale) < 0) throw new Error('Invalid profile.');
  if (!String(profile.name || '').trim() || !String(profile.bio || '').trim() || !String(profile.role || '').trim()) throw new Error('Incomplete profile.');
  if (profile.image && !/^\/api\/content-media\/[A-Za-z0-9_-]{10,}$/.test(profile.image)) throw new Error('Invalid profile image.');
  var previous = readCmsProfiles_().filter(function(p){return p.id === profile.id && p.locale === profile.locale;})[0];
  if (profile.approved || (previous && previous.approved)) assertCmsCapability_(actor, 'publish');
  var sheet = cmsSheet_('CMS Faculty', CMS_PROFILE_HEADERS), key = profile.locale + ':' + profile.id;
  var row = findCmsRowById_(sheet, key), values = [key, JSON.stringify(profile)];
  if (row < 0) sheet.appendRow(values); else sheet.getRange(row,1,1,2).setValues([values]);
  cmsAudit_(actor, 'profile.save', 'faculty', key, { approved:profile.approved });
  return profile;
}

var CMS_INSTITUTE_HEADERS = ['Key','InstituteJson'];
function readCmsInstitutes_() {
  var sheet = cmsSheet_('CMS Institutes', CMS_INSTITUTE_HEADERS);
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2,1,sheet.getLastRow()-1,2).getDisplayValues().filter(function(r){return r[0];}).map(function(r){return JSON.parse(r[1]);});
}
function saveCmsInstitute_(item, actor) {
  if (!item || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || ['en','fr','ar','fa'].indexOf(item.locale) < 0 || !String(item.country || '').trim() || !String(item.institute || '').trim() || !Array.isArray(item.details) || !item.details.length || !item.details.every(function(x){return typeof x === 'string' && x.trim();}) || !Number.isSafeInteger(item.order) || item.order < 0 || typeof item.approved !== 'boolean') throw new Error('Invalid institute.');
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var previous = readCmsInstitutes_().filter(function(x){return x.id === item.id && x.locale === item.locale;})[0];
    if (item.approved || (previous && previous.approved)) assertCmsCapability_(actor, 'publish');
    var sheet = cmsSheet_('CMS Institutes', CMS_INSTITUTE_HEADERS), key = item.locale + ':' + item.id;
    var row = findCmsRowById_(sheet, key), values = [key, JSON.stringify(item)];
    if (row < 0) sheet.appendRow(values); else sheet.getRange(row,1,1,2).setValues([values]);
    cmsAudit_(actor,'institute.save','institute',key,{approved:item.approved});
    return item;
  } finally { lock.releaseLock(); }
}
function deleteCmsInstitute_(data, actor) {
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var key = data.locale + ':' + data.id, sheet = cmsSheet_('CMS Institutes', CMS_INSTITUTE_HEADERS);
    var row = findCmsRowById_(sheet, key);
    if (row < 0) throw new Error('Institute not found.');
    sheet.deleteRow(row); cmsAudit_(actor,'institute.delete','institute',key,{});
    return {id:data.id};
  } finally { lock.releaseLock(); }
}
