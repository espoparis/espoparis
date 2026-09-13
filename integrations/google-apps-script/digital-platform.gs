/**
 * ESPO Paris — Digital Library + Learning metadata bridge (Phase 39)
 * Deploy as a Web App owned by digital@espoparis.com.
 * Script properties required:
 * DIGITAL_API_SECRET, DIGITAL_DATABASE_SPREADSHEET_ID, DIGITAL_ADMIN_EMAILS,
 * DIGITAL_LIBRARY_EDITOR_EMAILS, DIGITAL_LEARNING_EDITOR_EMAILS
 */
const DIGITAL = {
  librarySheet: 'Library Catalog',
  learningSheet: 'Learning Catalog',
  staffSheet: 'Digital Staff Roles',
  entitlementSheet: 'Digital Entitlements',
  auditSheet: 'Digital Audit Log',
  databaseFolderId: '1b83CAF_lcV8YrPUFpBKfiyjJ3QfJFQFF',
  libraryBooksFolderId: '1SvUs5GA91RweQkJACbZhe5oIX0r0cczh',
  libraryCoversFolderId: '1pWWG3AI0NpnPyROc5TCSONTN59flIZGc',
  libraryIntakeFolderId: '1_mKhZLg_ZRri40-5KqkSDDjEjwjZb_Kl',
  libraryArchiveFolderId: '1C1x33E7mysffiBHZZ6hHz3or_jqV-5kw',
  learningRootFolderId: '1pnSmZsoIfdvOZ-NTcOnbhRMOwhevkjCR',
  learningSemesterFolderIds: {
    1: '1EN5cncfSbdXokOgTw4YCgup6VaMzZac2', 2: '1ehK0UV6XGPsq-3PSBP8zjQQPYExPdqtR',
    3: '1ylL_ExqnLEh1SLjPvfsy02qcapwzYZRe', 4: '1H-lc_ibm_VMwfMXGOz4ehe8gCaep-oPo',
    5: '1cfhoQ1cPMKvbC46a4HrIk26WMsEg6E4U', 6: '1jCbzc8lkY0bkXzsPPfziYNlptivAw7B3',
    7: '1cxhsCYujpQfuMHytrBqPC0jEmSt-Anse', 8: '1AT71ejPSbkoTg3QGfnpnr1PYPL4JpyOc',
  },
  learningSharedResourcesFolderId: '1xPsdvEafefdQZvMTjd77X6F9MS7KHySR',
  learningArchiveFolderId: '1HY48oeUwK9H1gbQ5OjbaVxbCDteDIOV_',
  libraryHeaders: ['Id','Slug','Title','Author','Description','Language','Category','PublicationYear','PageCount','CoverFileId','PdfFileId','AccessLevel','Status','UpdatedAt','UpdatedBy'],
  learningHeaders: ['Id','CourseId','CourseTitle','Title','Description','AcademicYear','Year','Semester','Order','VideoFileId','AudioFileId','AttachmentFileIds','AccessLevel','Status','UpdatedAt','UpdatedBy'],
  staffHeaders: ['Email','DisplayName','Role','Status','UpdatedAt','UpdatedBy'],
  entitlementHeaders: ['Id','UserId','ResourceKind','ResourceId','Status','ExpiresAt','CreatedAt','UpdatedAt','UpdatedBy'],
  auditHeaders: ['Timestamp','ActorEmail','ActorRole','Action','RecordType','RecordId','Status','Detail'],
};

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    verifyDigitalRequest_(body);
    const result = dispatchDigital_(body.action, body.data || {}, body.actor || null);
    return jsonDigital_({ ok: true, result });
  } catch (err) {
    return jsonDigital_({ ok: false, error: err && err.message ? err.message : String(err) });
  }
}

function dispatchDigital_(action, data, actor) {
  if (action === 'digital.public.snapshot') return publicDigitalSnapshot_();
  if (action === 'digital.asset.resolve') return resolveDigitalAsset_(data);
  if (action === 'digital.staff.resolve') return resolveDigitalStaff_(data.email);
  if (action === 'digital.entitlement.check') return checkDigitalEntitlement_(data);
  requireDigitalActor_(actor);
  if (action === 'digital.admin.snapshot') return adminDigitalSnapshot_(actor);
  if (action === 'digital.media.upload') return uploadLibraryFile_(data, actor);
  if (action === 'digital.library.save') return saveLibraryRecord_(data.record, actor);
  if (action === 'digital.learning.save') return saveLearningRecord_(data.record, actor);
  if (action === 'digital.library.transition') return transitionDigitalRecord_('library', data.id, data.status, actor);
  if (action === 'digital.learning.transition') return transitionDigitalRecord_('learning', data.id, data.status, actor);
  throw new Error('Unsupported digital action.');
}

function provisionDigitalPlatform() {
  const ss = digitalSpreadsheet_();
  ensureSheet_(ss, DIGITAL.librarySheet, DIGITAL.libraryHeaders);
  ensureSheet_(ss, DIGITAL.learningSheet, DIGITAL.learningHeaders);
  ensureSheet_(ss, DIGITAL.staffSheet, DIGITAL.staffHeaders);
  ensureSheet_(ss, DIGITAL.entitlementSheet, DIGITAL.entitlementHeaders);
  ensureSheet_(ss, DIGITAL.auditSheet, DIGITAL.auditHeaders);
  return { ok: true, spreadsheetId: ss.getId() };
}

function publicDigitalSnapshot_() {
  return {
    books: readDigitalRows_(DIGITAL.librarySheet, DIGITAL.libraryHeaders).filter(r => r.status === 'published'),
    lessons: readDigitalRows_(DIGITAL.learningSheet, DIGITAL.learningHeaders).filter(r => r.status === 'published'),
  };
}

function adminDigitalSnapshot_(actor) {
  if (actor.role === 'admin') {
    requireDigitalAdmin_(actor);
    return { books: readDigitalRows_(DIGITAL.librarySheet, DIGITAL.libraryHeaders), lessons: readDigitalRows_(DIGITAL.learningSheet, DIGITAL.learningHeaders) };
  }
  if (actor.role === 'editor') {
    requireLibraryEditor_(actor);
    return { books: readDigitalRows_(DIGITAL.librarySheet, DIGITAL.libraryHeaders), lessons: [] };
  }
  requireLearningEditor_(actor);
  return { books: [], lessons: readDigitalRows_(DIGITAL.learningSheet, DIGITAL.learningHeaders) };
}

function resolveDigitalStaff_(emailInput) {
  const email = normalizeDigitalEmail_(emailInput);
  if (!email || email.indexOf('@') < 1) throw new Error('Valid staff email required.');
  const matches = readDigitalRows_(DIGITAL.staffSheet, DIGITAL.staffHeaders).filter(r => normalizeDigitalEmail_(r.email) === email);
  if (matches.length > 1) throw new Error('Duplicate digital staff record.');
  if (!matches.length) return null;
  const record = matches[0];
  if (['teacher','academic-officer','finance','editor','admin'].indexOf(String(record.role)) < 0) throw new Error('Invalid persisted staff role.');
  if (['invited','active','suspended','departed'].indexOf(String(record.status)) < 0) throw new Error('Invalid persisted staff status.');
  return { email, role: String(record.role), status: String(record.status) };
}

function checkDigitalEntitlement_(lookup) {
  const userId = String(lookup && lookup.userId || '').trim();
  const resourceKind = String(lookup && lookup.resourceKind || '').trim();
  const resourceId = String(lookup && lookup.resourceId || '').trim();
  if (!userId || !resourceId || ['book','course','lesson'].indexOf(resourceKind) < 0) throw new Error('Invalid entitlement lookup.');
  const now = Date.now();
  const entitled = readDigitalRows_(DIGITAL.entitlementSheet, DIGITAL.entitlementHeaders).some(r => {
    if (String(r.userId) !== userId || String(r.resourceKind) !== resourceKind || String(r.resourceId) !== resourceId || String(r.status) !== 'active') return false;
    const expiresAt = String(r.expiresAt || '').trim();
    return !expiresAt || (isFinite(Date.parse(expiresAt)) && Date.parse(expiresAt) > now);
  });
  return { entitled };
}

function resolveDigitalAsset_(selector) {
  if (!selector || ['book','lesson'].indexOf(String(selector.resourceKind)) < 0) throw new Error('Invalid digital asset selector.');
  const resourceId = String(selector.resourceId || '').trim(), assetKind = String(selector.assetKind || '');
  if (!resourceId) throw new Error('Digital resource id is required.');
  if (selector.resourceKind === 'book') {
    const book = findDigitalRecord_('library', resourceId);
    if (!book || book.status !== 'published') return null;
    validateLibraryRecord_(book); validateLibraryAssetLocations_(book);
    const bookFileId = assetKind === 'pdf' ? book.pdfFileId : assetKind === 'cover' ? book.coverFileId : '';
    return bookFileId ? { accessLevel: book.accessLevel, fileId: String(bookFileId) } : null;
  }
  const lesson = findDigitalRecord_('learning', resourceId);
  if (!lesson || lesson.status !== 'published') return null;
  validateLearningRecord_(lesson); validateLearningAssetLocations_(lesson);
  let lessonFileId = assetKind === 'video' ? lesson.videoFileId : assetKind === 'audio' ? lesson.audioFileId : '';
  if (assetKind === 'attachment') {
    const index = Number(selector.attachmentIndex);
    if (!Number.isInteger(index) || index < 0) throw new Error('Invalid attachment index.');
    lessonFileId = (lesson.attachmentFileIds || [])[index] || '';
  }
  return lessonFileId ? { accessLevel: lesson.accessLevel, fileId: String(lessonFileId) } : null;
}

function saveLibraryRecord_(record, actor) {
  if (!record || !String(record.id || '').trim()) throw new Error('Library record id is required.');
  if (!String(record.pdfFileId || '').trim()) throw new Error('PDF file id is required.');
  const normalized = {
    id: String(record.id).trim(), slug: String(record.slug || '').trim(), title: String(record.title || '').trim(), author: String(record.author || '').trim(),
    description: String(record.description || ''), language: String(record.language || '').trim(), category: String(record.category || '').trim(),
    publicationYear: record.publicationYear || '', pageCount: record.pageCount || '', coverFileId: String(record.coverFileId || ''), pdfFileId: String(record.pdfFileId),
    accessLevel: String(record.accessLevel || 'public'), status: String(record.status || 'draft'), updatedAt: new Date().toISOString(), updatedBy: actor.email,
  };
  validateStatus_(normalized.status); validateAccess_(normalized.accessLevel);
  validateLibraryRecord_(normalized);
  const existing = findDigitalRecord_('library', normalized.id);
  assertDigitalSaveStatus_(existing, normalized.status);
  if (existing && ['published','archived'].indexOf(existing.status) >= 0) requireDigitalAdmin_(actor); else requireLibraryEditor_(actor);
  validateLibraryAssetLocations_(normalized);
  requireDigitalAuditSheet_();
  upsertDigitalRow_(DIGITAL.librarySheet, DIGITAL.libraryHeaders, normalized);
  auditDigital_(actor, 'library.save', 'library', normalized.id, normalized.status, 'Metadata saved');
  return normalized;
}

function saveLearningRecord_(record, actor) {
  if (!record || !String(record.id || '').trim()) throw new Error('Lesson id is required.');
  const semester = Number(record.semester), year = Number(record.year);
  if (year < 1 || year > 4 || semester < 1 || semester > 8 || Math.ceil(semester / 2) !== year) throw new Error('Year and semester do not match.');
  const fileIds = [record.videoFileId, record.audioFileId].concat(record.attachmentFileIds || []).filter(Boolean);
  if (!fileIds.length) throw new Error('Lesson requires at least one digital asset.');
  const normalized = {
    id: String(record.id).trim(), courseId: String(record.courseId || '').trim(), courseTitle: String(record.courseTitle || '').trim(), title: String(record.title || '').trim(),
    description: String(record.description || ''), academicYear: String(record.academicYear || '').trim(), year, semester, order: Number(record.order || 0),
    videoFileId: String(record.videoFileId || ''), audioFileId: String(record.audioFileId || ''), attachmentFileIds: (record.attachmentFileIds || []).join(','),
    accessLevel: String(record.accessLevel || 'student-only'), status: String(record.status || 'draft'), updatedAt: new Date().toISOString(), updatedBy: actor.email,
  };
  validateStatus_(normalized.status); validateAccess_(normalized.accessLevel);
  validateLearningRecord_(normalized);
  const existing = findDigitalRecord_('learning', normalized.id);
  assertDigitalSaveStatus_(existing, normalized.status);
  if (existing && ['published','archived'].indexOf(existing.status) >= 0) requireDigitalAdmin_(actor); else requireLearningEditor_(actor);
  validateLearningAssetLocations_(normalized);
  requireDigitalAuditSheet_();
  upsertDigitalRow_(DIGITAL.learningSheet, DIGITAL.learningHeaders, normalized);
  auditDigital_(actor, 'learning.save', 'learning', normalized.id, normalized.status, 'Metadata saved');
  return normalized;
}

function transitionDigitalRecord_(type, id, status, actor) {
  validateStatus_(status);
  if (type !== 'library' && type !== 'learning') throw new Error('Invalid digital record type.');
  const sheetName = type === 'library' ? DIGITAL.librarySheet : DIGITAL.learningSheet;
  const headers = type === 'library' ? DIGITAL.libraryHeaders : DIGITAL.learningHeaders;
  const ss = digitalSpreadsheet_(), sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Digital metadata sheet is missing.');
  const values = sheet.getDataRange().getValues();
  const idCol = headers.indexOf('Id'), statusCol = headers.indexOf('Status'), updatedAtCol = headers.indexOf('UpdatedAt'), updatedByCol = headers.indexOf('UpdatedBy');
  const row = values.findIndex((r, i) => i > 0 && String(r[idCol]) === String(id));
  if (row < 1) throw new Error('Digital record not found.');
  const current = {}; headers.forEach((h, i) => current[camelDigital_(h)] = values[row][i]);
  const from = String(current.status || '');
  if (!canTransitionDigitalStatus_(from, status)) throw new Error('Invalid digital status transition.');
  if (from === 'published' || from === 'archived' || status === 'published' || status === 'archived') requireDigitalAdmin_(actor);
  else if (type === 'library') requireLibraryEditor_(actor); else requireLearningEditor_(actor);
  current.status = status;
  if (type === 'library') { validateLibraryRecord_(current); validateLibraryAssetLocations_(current); }
  else { validateLearningRecord_(current); validateLearningAssetLocations_(current); }
  requireDigitalAuditSheet_();
  sheet.getRange(row + 1, statusCol + 1).setValue(status);
  sheet.getRange(row + 1, updatedAtCol + 1).setValue(new Date().toISOString());
  sheet.getRange(row + 1, updatedByCol + 1).setValue(actor.email);
  auditDigital_(actor, type + '.transition', type, id, status, 'Status changed from ' + from + ' to ' + status);
  return { id, status };
}

function readDigitalRows_(sheetName, headers) {
  const sheet = digitalSpreadsheet_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues().filter(r => r.some(v => v !== '')).map(row => {
    const o = {}; headers.forEach((h, i) => o[camelDigital_(h)] = row[i]);
    if (sheetName === DIGITAL.librarySheet) { o.published = o.status === 'published'; o.pdfAssetId = o.pdfFileId; o.coverAssetId = o.coverFileId || undefined; }
    if (sheetName === DIGITAL.learningSheet) { o.published = o.status === 'published'; o.attachmentFileIds = String(o.attachmentFileIds || '').split(',').map(s => s.trim()).filter(Boolean); o.attachmentAssetIds = o.attachmentFileIds; o.videoAssetId = o.videoFileId || undefined; o.audioAssetId = o.audioFileId || undefined; }
    return o;
  });
}

function upsertDigitalRow_(sheetName, headers, record) {
  const sheet = digitalSpreadsheet_().getSheetByName(sheetName);
  if (!sheet) throw new Error('Digital metadata sheet is missing. Run provisionDigitalPlatform().');
  const data = sheet.getDataRange().getValues();
  const idIdx = headers.indexOf('Id');
  const rowIdx = data.findIndex((r, i) => i > 0 && String(r[idIdx]) === String(record.id));
  const row = headers.map(h => record[camelDigital_(h)] === undefined ? '' : record[camelDigital_(h)]);
  if (rowIdx > 0) sheet.getRange(rowIdx + 1, 1, 1, headers.length).setValues([row]); else sheet.appendRow(row);
}

function digitalSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('DIGITAL_DATABASE_SPREADSHEET_ID');
  if (!id) throw new Error('DIGITAL_DATABASE_SPREADSHEET_ID is not configured.');
  assertFileInFolder_(id, DIGITAL.databaseFolderId, 'Digital database spreadsheet');
  return SpreadsheetApp.openById(id);
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name); if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  const actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0].map(String);
  if (actual.join('|') !== headers.join('|')) throw new Error('Header mismatch in ' + name + '.');
  sheet.setFrozenRows(1);
  return sheet;
}

function assertFileInFolder_(fileId, folderId, label) {
  const file = DriveApp.getFileById(fileId), parents = file.getParents();
  while (parents.hasNext()) if (parents.next().getId() === folderId) return;
  throw new Error(label + ' file is outside the approved Drive folder.');
}

function assertDescendantOf_(fileId, rootFolderId, label) {
  let frontier = []; const file = DriveApp.getFileById(fileId), parents = file.getParents();
  while (parents.hasNext()) frontier.push(parents.next());
  const seen = {};
  while (frontier.length) {
    const folder = frontier.shift(); if (!folder || seen[folder.getId()]) continue; seen[folder.getId()] = true;
    if (folder.getId() === rootFolderId) return;
    const p = folder.getParents(); while (p.hasNext()) frontier.push(p.next());
  }
  throw new Error(label + ' is outside the approved Learning Platform tree.');
}

function assertFileInFolders_(fileId, folderIds, label) {
  const file = DriveApp.getFileById(String(fileId)), parents = file.getParents();
  while (parents.hasNext()) if (folderIds.indexOf(parents.next().getId()) >= 0) return;
  throw new Error(label + ' file is outside its approved Drive folder.');
}

function assertDescendantOfAny_(fileId, rootFolderIds, label) {
  let frontier = []; const file = DriveApp.getFileById(String(fileId)), parents = file.getParents();
  while (parents.hasNext()) frontier.push(parents.next());
  const seen = {};
  while (frontier.length) {
    const folder = frontier.shift(); if (!folder || seen[folder.getId()]) continue; seen[folder.getId()] = true;
    if (rootFolderIds.indexOf(folder.getId()) >= 0) return;
    const p = folder.getParents(); while (p.hasNext()) frontier.push(p.next());
  }
  throw new Error(label + ' is outside its approved Drive tree.');
}

function findDigitalRecord_(type, id) {
  const sheetName = type === 'library' ? DIGITAL.librarySheet : DIGITAL.learningSheet;
  const headers = type === 'library' ? DIGITAL.libraryHeaders : DIGITAL.learningHeaders;
  return readDigitalRows_(sheetName, headers).find(r => String(r.id) === String(id)) || null;
}

function assertDigitalSaveStatus_(existing, requestedStatus) {
  if (!existing && requestedStatus !== 'draft') throw new Error('New digital records must start as draft.');
  if (existing && existing.status !== requestedStatus) throw new Error('Use the transition action to change digital record status.');
}

function validateLibraryRecord_(record) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(record.slug || ''))) throw new Error('Library slug is invalid.');
  if (!String(record.title || '').trim()) throw new Error('Library title is required.');
  if (!String(record.author || '').trim()) throw new Error('Library author is required.');
  if (!String(record.language || '').trim()) throw new Error('Library language is required.');
  if (!String(record.category || '').trim()) throw new Error('Library category is required.');
  if (!String(record.pdfFileId || '').trim()) throw new Error('Library PDF file id is required.');
  if (record.publicationYear !== '' && (!Number.isInteger(Number(record.publicationYear)) || Number(record.publicationYear) < 1)) throw new Error('Publication year is invalid.');
  if (record.pageCount !== '' && (!Number.isInteger(Number(record.pageCount)) || Number(record.pageCount) < 1)) throw new Error('Page count is invalid.');
}

function validateLearningRecord_(record) {
  const year = Number(record.year), semester = Number(record.semester), order = Number(record.order);
  if (!String(record.courseId || '').trim()) throw new Error('Course id is required.');
  if (!String(record.courseTitle || '').trim()) throw new Error('Course title is required.');
  if (!String(record.title || '').trim()) throw new Error('Lesson title is required.');
  if (!String(record.academicYear || '').trim()) throw new Error('Academic year is required.');
  if (!Number.isInteger(year) || year < 1 || year > 4 || !Number.isInteger(semester) || semester < 1 || semester > 8 || Math.ceil(semester / 2) !== year) throw new Error('Year and semester do not match.');
  if (!Number.isInteger(order) || order < 0) throw new Error('Lesson order must be a non-negative integer.');
  if (!learningFileIds_(record).length) throw new Error('Lesson requires at least one digital asset.');
}

function learningFileIds_(record) {
  let attachments = record.attachmentFileIds || [];
  if (!Array.isArray(attachments)) attachments = String(attachments).split(',').map(s => s.trim()).filter(Boolean);
  return [record.videoFileId, record.audioFileId].concat(attachments).filter(Boolean).map(String);
}

function validateLibraryAssetLocations_(record) {
  let pdfFolders, coverFolders;
  if (record.status === 'published') {
    pdfFolders = [DIGITAL.libraryBooksFolderId]; coverFolders = [DIGITAL.libraryCoversFolderId];
  } else if (record.status === 'archived') {
    pdfFolders = [DIGITAL.libraryArchiveFolderId]; coverFolders = [DIGITAL.libraryArchiveFolderId];
  } else {
    pdfFolders = [DIGITAL.libraryBooksFolderId, DIGITAL.libraryIntakeFolderId];
    coverFolders = [DIGITAL.libraryCoversFolderId, DIGITAL.libraryIntakeFolderId];
  }
  assertFileInFolders_(record.pdfFileId, pdfFolders, 'PDF');
  if (record.coverFileId) assertFileInFolders_(record.coverFileId, coverFolders, 'cover');
}

function validateLearningAssetLocations_(record) {
  const fileIds = learningFileIds_(record);
  if (record.status === 'published') {
    const semesterFolder = DIGITAL.learningSemesterFolderIds[Number(record.semester)];
    fileIds.forEach(id => assertDescendantOfAny_(id, [semesterFolder, DIGITAL.learningSharedResourcesFolderId], 'published learning asset'));
  } else if (record.status === 'archived') {
    fileIds.forEach(id => assertDescendantOfAny_(id, [DIGITAL.learningArchiveFolderId], 'archived learning asset'));
  } else {
    fileIds.forEach(id => assertDescendantOf_(id, DIGITAL.learningRootFolderId, 'learning asset'));
  }
}

function canTransitionDigitalStatus_(from, to) {
  const allowed = {
    draft: ['review','archived'], review: ['draft','published','archived'],
    published: ['archived'], archived: ['draft']
  };
  return Boolean(allowed[from] && allowed[from].indexOf(to) >= 0);
}

function requireDigitalAuditSheet_() {
  const sheet = digitalSpreadsheet_().getSheetByName(DIGITAL.auditSheet);
  if (!sheet) throw new Error('Digital Audit Log sheet is missing. Run provisionDigitalPlatform().');
  const actual = sheet.getRange(1, 1, 1, DIGITAL.auditHeaders.length).getDisplayValues()[0].map(String);
  if (actual.join('|') !== DIGITAL.auditHeaders.join('|')) throw new Error('Header mismatch in ' + DIGITAL.auditSheet + '.');
  return sheet;
}

function verifyDigitalRequest_(body) {
  const secret = PropertiesService.getScriptProperties().getProperty('DIGITAL_API_SECRET');
  if (!secret || secret.length < 32) throw new Error('Digital API secret is not configured securely.');
  if (!body || !body.action || !body.issuedAt || !body.nonce || !body.signature) throw new Error('Invalid signed request.');
  const issued = Date.parse(body.issuedAt); if (!isFinite(issued) || Math.abs(Date.now() - issued) > 5 * 60 * 1000) throw new Error('Expired request.');
  const cache = CacheService.getScriptCache(); if (cache.get('digital-nonce:' + body.nonce)) throw new Error('Replay detected.');
  const canonical = canonicalDigital_({ action: body.action, actor: body.actor || null, data: body.data || {}, issuedAt: body.issuedAt, nonce: body.nonce });
  const bytes = Utilities.computeHmacSha256Signature(canonical, secret);
  const expected = bytes.map(b => ('0' + ((b < 0 ? b + 256 : b).toString(16))).slice(-2)).join('');
  if (!constantTimeDigital_(expected, String(body.signature))) throw new Error('Invalid signature.');
  cache.put('digital-nonce:' + body.nonce, '1', 600);
}

function canonicalDigital_(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalDigital_).join(',') + ']';
  return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonicalDigital_(value[k])).join(',') + '}';
}
function constantTimeDigital_(a, b) { if (a.length !== b.length) return false; let x = 0; for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i); return x === 0; }
function camelDigital_(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
function validateStatus_(s) { if (['draft','review','published','archived'].indexOf(s) < 0) throw new Error('Invalid digital record status.'); }
function validateAccess_(s) { if (['public','registered-free','student-only','paid'].indexOf(s) < 0) throw new Error('Invalid digital access level.'); }
function normalizeDigitalEmail_(value) { return String(value || '').trim().toLowerCase(); }
function digitalAllowedEmails_(propertyName) {
  return String(PropertiesService.getScriptProperties().getProperty(propertyName) || '').split(',').map(normalizeDigitalEmail_).filter(Boolean);
}
function requireDigitalActor_(a) {
  const email = normalizeDigitalEmail_(a && a.email);
  if (!a || !email || email.indexOf('@') < 1 || !a.role) throw new Error('Authenticated actor required.');
  return email;
}
function requireDigitalEmail_(email, propertyName) {
  const allowed = digitalAllowedEmails_(propertyName);
  if (!allowed.length) throw new Error(propertyName + ' is not configured.');
  if (allowed.indexOf(email) < 0) throw new Error('Digital actor is not allowlisted for this operation.');
}
function requireLibraryEditor_(a) {
  const email = requireDigitalActor_(a);
  if (a.role === 'admin') return requireDigitalAdmin_(a);
  if (a.role !== 'editor') throw new Error('Library editor permission required.');
  requireDigitalEmail_(email, 'DIGITAL_LIBRARY_EDITOR_EMAILS');
}
function requireLearningEditor_(a) {
  const email = requireDigitalActor_(a);
  if (a.role === 'admin') return requireDigitalAdmin_(a);
  if (a.role !== 'academic-officer') throw new Error('Learning administrator permission required.');
  requireDigitalEmail_(email, 'DIGITAL_LEARNING_EDITOR_EMAILS');
}
function requireDigitalAdmin_(a) {
  const email = requireDigitalActor_(a);
  if (a.role !== 'admin') throw new Error('Master admin permission required for publish/archive.');
  requireDigitalEmail_(email, 'DIGITAL_ADMIN_EMAILS');
}
function auditDigital_(actor, action, type, id, status, detail) {
  requireDigitalAuditSheet_().appendRow([new Date().toISOString(), normalizeDigitalEmail_(actor.email), actor.role, action, type, id, status, detail]);
}
function jsonDigital_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }


function uploadLibraryFile_(data, actor) {
  requireLibraryEditor_(actor);
  if (['book-pdf','book-cover'].indexOf(data.purpose) < 0) throw new Error('Invalid upload purpose.');
  var isPdf = data.purpose === 'book-pdf';
  if (!data.base64 || data.base64.length > (isPdf ? 4194304 : 1400000)) throw new Error('File too large.');
  var bytes = Utilities.base64Decode(data.base64), b = bytes.slice(0,12).map(function(v){return (v+256)%256;});
  if (!bytes.length || bytes.length > (isPdf ? 3145728 : 1048576)) throw new Error('File too large.');
  var valid = isPdf ? data.mime === 'application/pdf' && String.fromCharCode.apply(null,b.slice(0,5)) === '%PDF-' :
    ((data.mime === 'image/jpeg' && b[0] === 255 && b[1] === 216 && b[2] === 255) ||
    (data.mime === 'image/png' && b.slice(0,8).join(',') === '137,80,78,71,13,10,26,10') ||
    (data.mime === 'image/webp' && String.fromCharCode.apply(null,b.slice(0,4)) === 'RIFF' && String.fromCharCode.apply(null,b.slice(8,12)) === 'WEBP'));
  if (!valid) throw new Error('Invalid file format.');
  var folder = DriveApp.getFolderById(isPdf ? DIGITAL.libraryBooksFolderId : DIGITAL.libraryCoversFolderId);
  var file = folder.createFile(Utilities.newBlob(bytes, data.mime, String(data.name || 'file').slice(0,120)));
  return { id:file.getId() };
}
