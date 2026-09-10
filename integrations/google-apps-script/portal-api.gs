/**
 * Signed serverless bridge between Next.js and Google Workspace.
 * Deploy only after setting PORTAL_API_SECRET (>= 32 chars).
 * Browser clients never call this Web App directly; only the Next.js server does.
 */
function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    validatePortalRequest_(body);
    var action = body.action;
    var data = body.data || {};
    var actor = body.actor || {};
    var result;

    if (action === 'health') result = { ok: true, service: 'espo-workspace-bridge' };
    else if (action === 'student.lookup') result = lookupStudentByEmail_(data.email);
    else if (action === 'student.academic-snapshot') result = studentAcademicSnapshotForVerifiedEmail_(data.email);
    else if (action === 'academic.grade.save-draft') result = saveGradeDraft_(data, actor.email);
    else if (action === 'academic.grade.submit') result = transitionGrade_(data, actor.email, 'submitted');
    else if (action === 'academic.grade.approve') result = transitionGrade_(data, actor.email, 'approved');
    else if (action === 'academic.grade.return') result = transitionGrade_(data, actor.email, 'returned');
    else if (action === 'academic.grade.publish') result = transitionGrade_(data, actor.email, 'published');
    else if (action === 'academic.attendance.record') result = recordAttendance_(data, actor.email);
    else if (action === 'admin.enrollment.audit') { assertEnrollmentAdmin_(actor.email); result = enrollmentIntegrityAudit_(); }
    else if (action === 'admin.enrollment.repair') { assertEnrollmentAdmin_(actor.email); if (data.confirmation !== 'APPLY-ENROLLMENT-REPAIR') throw new Error('Explicit enrollment repair confirmation is required.'); if (!data.auditToken) throw new Error('Fresh enrollment audit token is required.'); result = repairCentralEnrollment(true, data.auditToken); }
    else throw new Error('Unsupported action: ' + action);

    return jsonResponse_({ ok: true, result: result });
  } catch (error) {
    return jsonResponse_({ ok: false, error: error.message });
  }
}

function validatePortalRequest_(body) {
  var secret = PropertiesService.getScriptProperties().getProperty('PORTAL_API_SECRET');
  if (!secret || secret.length < 32) throw new Error('PORTAL_API_SECRET is not configured.');
  if (!body || !body.action || !body.issuedAt || !body.nonce || !body.signature) throw new Error('Malformed portal request.');
  var issued = new Date(body.issuedAt).getTime();
  if (!issued || Math.abs(Date.now() - issued) > 5 * 60 * 1000) throw new Error('Expired portal request.');
  var nonceCache = CacheService.getScriptCache();
  var nonceKey = 'portal-nonce:' + String(body.nonce);
  if (nonceCache.get(nonceKey)) throw new Error('Replay detected.');
  var unsigned = { action: body.action, issuedAt: body.issuedAt, nonce: body.nonce, data: body.data, actor: body.actor || null };
  var expected = hmacHex_(canonicalJson_(unsigned), secret);
  if (!constantTimeEquals_(expected, String(body.signature))) throw new Error('Invalid portal signature.');
  nonceCache.put(nonceKey, '1', 300);
}

function assertEnrollmentAdmin_(email) {
  email = normalizeEmail_(email);
  var raw = PropertiesService.getScriptProperties().getProperty('ENROLLMENT_ADMIN_EMAILS') || '';
  var allowed = raw.split(',').map(function(v) { return normalizeEmail_(v); }).filter(Boolean);
  if (!email || allowed.indexOf(email) < 0) throw new Error('Enrollment administrator access is not authorized for this account.');
}

function enrollmentIntegrityAudit_() {
  return auditCentralEnrollment();
}

function lookupStudentByEmail_(email) {
  email = normalizeEmail_(email);
  if (!email) return null;
  var sheet = centralSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;
  var rows = sheet.getRange(2, 1, lastRow - 1, CENTRAL_HEADERS.length).getDisplayValues();
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (normalizeEmail_(row[4]) !== email) continue;
    return {
      applicationId: row[0], submissionDate: row[1], language: row[2], fullName: row[3],
      email: normalizeEmail_(row[4]), dateOfBirth: row[5], educationLevel: row[6],
      academicDegree: row[7], latestCertificate: row[8], hawzaStudies: row[9],
      primaryLanguage: row[10], countryCity: row[13], phone: row[14], status: row[15],
      studentFolder: row[16]
    };
  }
  return null;
}

function studentAcademicSnapshotForVerifiedEmail_(email) {
  var student = lookupStudentByEmail_(email);
  if (!student || !student.applicationId) return null;
  return { student: student, academic: publishedAcademicSnapshot_(student.applicationId) };
}

function jsonResponse_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function canonicalJson_(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalJson_).join(',') + ']';
  var keys = Object.keys(value).sort();
  return '{' + keys.map(function(key) { return JSON.stringify(key) + ':' + canonicalJson_(value[key]); }).join(',') + '}';
}

function hmacHex_(message, secret) {
  var bytes = Utilities.computeHmacSha256Signature(message, secret);
  return bytes.map(function(byte) { var v = (byte < 0 ? byte + 256 : byte).toString(16); return v.length === 1 ? '0' + v : v; }).join('');
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
