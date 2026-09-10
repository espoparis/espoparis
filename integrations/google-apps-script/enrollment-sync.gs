/**
 * ESPO Paris / Imam Center enrollment synchronizer.
 *
 * Design goals:
 * - Keep the six Google Forms response sheets as raw submissions.
 * - Keep the existing AIC-YYYY-NNNN identifiers.
 * - Never create "Unknown Student" silently when the form already contains a name.
 * - Normalize by a stable canonical field order instead of translated header text.
 * - Use Script Properties for Drive/Sheet IDs so IDs are not committed publicly.
 * - Use LockService around sequence generation and database writes.
 * - Create shortcuts to uploaded files instead of copying bytes, reducing storage usage.
 *
 * Required Script Properties:
 * CENTRAL_SPREADSHEET_ID
 * CENTRAL_SHEET_NAME=Applications
 * STUDENT_ARCHIVE_FOLDER_ID
 * ENROLLMENT_BACKUP_FOLDER_ID
 * APPLICATION_YEAR=2026
 * SOURCE_ARABIC_SHEET_ID
 * SOURCE_ENGLISH_SHEET_ID
 * SOURCE_FRENCH_SHEET_ID
 * SOURCE_PERSIAN_SHEET_ID
 * SOURCE_TURKISH_SHEET_ID
 * SOURCE_AZERBAIJANI_SHEET_ID
 */

const SOURCE_FIELD_INDEX = Object.freeze({
  timestamp: 0,
  email: 1,
  fullName: 2,
  dateOfBirth: 3,
  educationLevel: 4,
  academicDegree: 5,
  latestCertificate: 6,
  hawzaStudies: 7,
  primaryLanguage: 8,
  personalPhoto: 9,
  identityDocument: 10,
  countryCity: 11,
  phone: 12,
});

const CENTRAL_HEADERS = Object.freeze([
  'Application Id', 'Submission Date', 'Language', 'Full name', 'Email',
  'Date of birth', 'Level of education', 'Academic degree',
  'Latest academic certificate', 'Hawza studies', 'Primary language',
  'Personal photo', 'Identity/passport', 'Country and city', 'Phone number',
  'Status', 'Student folder', 'Notes'
]);

function scriptConfig_() {
  const p = PropertiesService.getScriptProperties();
  return {
    centralSpreadsheetId: requiredProperty_(p, 'CENTRAL_SPREADSHEET_ID'),
    centralSheetName: p.getProperty('CENTRAL_SHEET_NAME') || 'Applications',
    archiveFolderId: requiredProperty_(p, 'STUDENT_ARCHIVE_FOLDER_ID'),
    backupFolderId: p.getProperty('ENROLLMENT_BACKUP_FOLDER_ID') || '',
    year: Number(p.getProperty('APPLICATION_YEAR') || new Date().getFullYear()),
    sources: {
      [requiredProperty_(p, 'SOURCE_ARABIC_SHEET_ID')]: 'Arabic',
      [requiredProperty_(p, 'SOURCE_ENGLISH_SHEET_ID')]: 'English',
      [requiredProperty_(p, 'SOURCE_FRENCH_SHEET_ID')]: 'French',
      [requiredProperty_(p, 'SOURCE_PERSIAN_SHEET_ID')]: 'Persian',
      [requiredProperty_(p, 'SOURCE_TURKISH_SHEET_ID')]: 'Turkish',
      [requiredProperty_(p, 'SOURCE_AZERBAIJANI_SHEET_ID')]: 'Azerbaijani',
    }
  };
}

function requiredProperty_(props, key) {
  const value = props.getProperty(key);
  if (!value) throw new Error('Missing Script Property: ' + key);
  return value;
}

function clean_(value) {
  return value == null ? '' : String(value).trim();
}

function normalizeEmail_(value) {
  return clean_(value).toLowerCase();
}

function normalizeSourceRow_(values, language) {
  if (!values || values.length < 13) {
    throw new Error('Enrollment row must contain at least 13 source columns.');
  }
  const fullName = clean_(values[SOURCE_FIELD_INDEX.fullName]);
  const email = normalizeEmail_(values[SOURCE_FIELD_INDEX.email]);
  if (!fullName) throw new Error('Full name is missing; refusing to create an Unknown Student record.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Invalid applicant email: ' + email);

  return {
    submissionDate: clean_(values[SOURCE_FIELD_INDEX.timestamp]),
    language: language,
    fullName: fullName,
    email: email,
    dateOfBirth: clean_(values[SOURCE_FIELD_INDEX.dateOfBirth]),
    educationLevel: clean_(values[SOURCE_FIELD_INDEX.educationLevel]),
    academicDegree: clean_(values[SOURCE_FIELD_INDEX.academicDegree]),
    latestCertificate: clean_(values[SOURCE_FIELD_INDEX.latestCertificate]),
    hawzaStudies: clean_(values[SOURCE_FIELD_INDEX.hawzaStudies]),
    primaryLanguage: clean_(values[SOURCE_FIELD_INDEX.primaryLanguage]),
    personalPhoto: clean_(values[SOURCE_FIELD_INDEX.personalPhoto]),
    identityDocument: clean_(values[SOURCE_FIELD_INDEX.identityDocument]),
    countryCity: clean_(values[SOURCE_FIELD_INDEX.countryCity]),
    phone: clean_(values[SOURCE_FIELD_INDEX.phone]),
  };
}

function centralSheet_() {
  const cfg = scriptConfig_();
  const ss = SpreadsheetApp.openById(cfg.centralSpreadsheetId);
  const sheet = ss.getSheetByName(cfg.centralSheetName);
  if (!sheet) throw new Error('Central sheet not found: ' + cfg.centralSheetName);
  verifyCentralHeaders_(sheet);
  return sheet;
}

function verifyCentralHeaders_(sheet) {
  const actual = sheet.getRange(1, 1, 1, CENTRAL_HEADERS.length).getDisplayValues()[0];
  CENTRAL_HEADERS.forEach(function(expected, index) {
    if (clean_(actual[index]) !== expected) {
      throw new Error('Central database header mismatch at column ' + (index + 1) + ': expected "' + expected + '", found "' + actual[index] + '".');
    }
  });
}

function nextApplicationId_(sheet, year) {
  const lastRow = sheet.getLastRow();
  let max = 0;
  if (lastRow > 1) {
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues().flat();
    ids.forEach(function(id) {
      const match = new RegExp('^AIC-' + year + '-(\\d{4,6})$').exec(clean_(id));
      if (match) max = Math.max(max, Number(match[1]));
    });
  }
  return 'AIC-' + year + '-' + String(max + 1).padStart(4, '0');
}

function findExistingByEmail_(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;
  const emails = sheet.getRange(2, 5, lastRow - 1, 1).getDisplayValues().flat();
  for (let i = 0; i < emails.length; i++) {
    if (normalizeEmail_(emails[i]) === email) return i + 2;
  }
  return null;
}

function centralRow_(applicationId, item, folderUrl) {
  return [
    applicationId, item.submissionDate, item.language, item.fullName, item.email,
    item.dateOfBirth, item.educationLevel, item.academicDegree, item.latestCertificate,
    item.hawzaStudies, item.primaryLanguage, item.personalPhoto, item.identityDocument,
    item.countryCity, item.phone, 'Pending Review', folderUrl, ''
  ];
}

function extractDriveId_(url) {
  if (!url) return null;
  const match = String(url).match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

function addUploadShortcuts_(folder, item) {
  [item.latestCertificate, item.personalPhoto, item.identityDocument].forEach(function(url) {
    const id = extractDriveId_(url);
    if (!id) return;
    try {
      const file = DriveApp.getFileById(id);
      folder.createShortcut(file.getId()).setName(file.getName());
    } catch (error) {
      console.warn('Could not create shortcut for upload: ' + url + ' - ' + error.message);
    }
  });
}

/** Installable spreadsheet onFormSubmit trigger target. */
function onEnrollmentFormSubmit(e) {
  const cfg = scriptConfig_();
  const sourceSpreadsheetId = e && e.source ? e.source.getId() : '';
  const language = cfg.sources[sourceSpreadsheetId];
  if (!language) throw new Error('This form response spreadsheet is not registered as an enrollment source.');

  const values = e.values || (e.range && e.range.getValues()[0]);
  const item = normalizeSourceRow_(values, language);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = centralSheet_();
    const duplicateRow = findExistingByEmail_(sheet, item.email);
    if (duplicateRow) {
      throw new Error('Duplicate enrollment email already exists in central database at row ' + duplicateRow + ': ' + item.email);
    }

    const applicationId = nextApplicationId_(sheet, cfg.year);
    const archiveRoot = DriveApp.getFolderById(cfg.archiveFolderId);
    const studentFolder = archiveRoot.createFolder(applicationId + ' - ' + item.fullName);
    addUploadShortcuts_(studentFolder, item);
    sheet.appendRow(centralRow_(applicationId, item, studentFolder.getUrl()));
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
}

/**
 * Phase 37 safety model:
 * - audit is always read-only;
 * - duplicate/ambiguous records are blockers, never guessed;
 * - applying requires the exact token returned by a fresh audit;
 * - a timestamped central spreadsheet backup is created automatically before writes;
 * - existing AIC IDs and non-empty administrator values are preserved.
 */
function auditCentralEnrollment() {
  return buildEnrollmentRepairPlan_();
}

/** Backward-compatible entry point. apply=false is audit only. */
function repairCentralEnrollment(apply, expectedAuditToken) {
  if (!apply) return auditCentralEnrollment();
  return applyEnrollmentRepair_(expectedAuditToken);
}

function buildEnrollmentRepairPlan_() {
  const cfg = scriptConfig_();
  const central = centralSheet_();
  const lastRow = central.getLastRow();
  const current = lastRow > 1
    ? central.getRange(2, 1, lastRow - 1, CENTRAL_HEADERS.length).getDisplayValues()
    : [];

  const blockers = [];
  const proposals = [];
  const centralByEmail = {};
  const seenIds = {};
  let missingNames = 0;
  let unknownFolders = 0;
  let duplicateEmails = 0;

  current.forEach(function(row, index) {
    const rowNumber = index + 2;
    const id = clean_(row[0]);
    const email = normalizeEmail_(row[4]);
    const fullName = clean_(row[3]);
    const folderNameOrUrl = clean_(row[16]);

    if (!/^AIC-\d{4}-\d{4,6}$/.test(id)) {
      blockers.push({ type: 'invalid-central-id', applicationId: id, message: 'Invalid or missing AIC ID at central row ' + rowNumber + '.' });
    } else if (seenIds[id]) {
      blockers.push({ type: 'duplicate-central-id', applicationId: id, message: 'Duplicate AIC ID at central rows ' + seenIds[id] + ' and ' + rowNumber + '.' });
    } else {
      seenIds[id] = rowNumber;
    }

    if (!fullName) missingNames++;
    if (/unknown student/i.test(folderNameOrUrl)) unknownFolders++;

    if (!email) {
      blockers.push({ type: 'missing-central-email', applicationId: id, message: 'Missing email at central row ' + rowNumber + '.' });
      return;
    }
    if (centralByEmail[email]) {
      duplicateEmails++;
      blockers.push({ type: 'duplicate-central-email', email: email, applicationId: id, message: 'Duplicate central email is ambiguous and requires manual review: ' + email });
      centralByEmail[email].ambiguous = true;
      return;
    }
    centralByEmail[email] = { rowNumber: rowNumber, row: row, ambiguous: false };
  });

  const seenSourceEmails = {};
  Object.keys(cfg.sources).forEach(function(sourceId) {
    const language = cfg.sources[sourceId];
    const source = SpreadsheetApp.openById(sourceId).getSheets()[0];
    const sourceLast = source.getLastRow();
    if (sourceLast <= 1) return;
    const sourceRows = source.getRange(2, 1, sourceLast - 1, Math.max(13, source.getLastColumn())).getDisplayValues();
    sourceRows.forEach(function(values, sourceIndex) {
      let normalized;
      try {
        normalized = normalizeSourceRow_(values, language);
      } catch (error) {
        blockers.push({ type: 'source-error', message: language + ' source row ' + (sourceIndex + 2) + ': ' + error.message });
        return;
      }

      if (seenSourceEmails[normalized.email]) {
        blockers.push({ type: 'duplicate-source-email', email: normalized.email, message: 'Applicant email occurs more than once across source responses: ' + normalized.email });
        return;
      }
      seenSourceEmails[normalized.email] = language + ':' + (sourceIndex + 2);

      const match = centralByEmail[normalized.email];
      if (!match || match.ambiguous) {
        if (!match) blockers.push({ type: 'missing-central-record', email: normalized.email, message: 'Source response has no central Applications record: ' + normalized.email });
        return;
      }

      const row = match.row.slice();
      const desired = centralRow_(row[0], normalized, row[16]);
      const updates = [];
      for (let i = 1; i <= 14; i++) {
        if (!clean_(row[i]) && clean_(desired[i])) updates.push({ column: i + 1, value: desired[i] });
      }
      if (updates.length) {
        proposals.push({ type: 'backfill', rowNumber: match.rowNumber, applicationId: row[0], email: normalized.email, updates: updates });
      }

      const folderUrl = clean_(row[16]);
      const folderId = extractDriveId_(folderUrl);
      if (folderId && normalized.fullName) {
        try {
          const folder = DriveApp.getFolderById(folderId);
          const targetName = row[0] + ' - ' + normalized.fullName;
          if (folder.getName() !== targetName) {
            proposals.push({ type: 'rename-folder', applicationId: row[0], folderId: folderId, from: folder.getName(), to: targetName });
          }
        } catch (error) {
          blockers.push({ type: 'folder-error', applicationId: row[0], message: 'Student folder cannot be verified: ' + error.message });
        }
      }
    });
  });

  const stable = {
    centralFingerprint: current.map(function(row) { return [clean_(row[0]), normalizeEmail_(row[4]), clean_(row[3]), clean_(row[16])]; }),
    blockers: blockers,
    proposals: proposals
  };
  const auditToken = sha256Hex_(JSON.stringify(stable));
  return {
    total: current.length,
    missingNames: missingNames,
    missingCentralRecords: blockers.filter(function(item) { return item.type === 'missing-central-record'; }).length,
    unknownFolders: unknownFolders,
    duplicateEmails: duplicateEmails + blockers.filter(function(item) { return item.type === 'duplicate-source-email'; }).length,
    blockers: blockers,
    proposals: proposals,
    auditToken: auditToken,
    canApply: blockers.length === 0
  };
}

function applyEnrollmentRepair_(expectedAuditToken) {
  const audit = buildEnrollmentRepairPlan_();
  if (!expectedAuditToken || expectedAuditToken !== audit.auditToken) {
    throw new Error('Enrollment audit is stale or missing. Run a fresh dry-run audit before applying repair.');
  }
  if (!audit.canApply || audit.blockers.length) {
    throw new Error('Enrollment repair is blocked by ' + audit.blockers.length + ' integrity issue(s). Resolve blockers manually and audit again.');
  }

  const backup = backupCentralEnrollment_();
  const central = centralSheet_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    audit.proposals.forEach(function(proposal) {
      if (proposal.type === 'backfill') {
        proposal.updates.forEach(function(update) {
          const cell = central.getRange(proposal.rowNumber, update.column);
          if (!clean_(cell.getDisplayValue())) cell.setValue(update.value);
        });
      } else if (proposal.type === 'rename-folder') {
        const folder = DriveApp.getFolderById(proposal.folderId);
        if (folder.getName() === proposal.from) folder.setName(proposal.to);
      }
    });
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  const postAudit = buildEnrollmentRepairPlan_();
  return {
    applied: audit.proposals.length,
    backupFileId: backup.id,
    backupFileUrl: backup.url,
    previousAuditToken: audit.auditToken,
    postAudit: postAudit
  };
}

function backupCentralEnrollment_() {
  const cfg = scriptConfig_();
  if (!cfg.backupFolderId) throw new Error('Missing Script Property: ENROLLMENT_BACKUP_FOLDER_ID');
  const source = DriveApp.getFileById(cfg.centralSpreadsheetId);
  const folder = DriveApp.getFolderById(cfg.backupFolderId);
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Etc/UTC', 'yyyy-MM-dd HH-mm-ss');
  const copy = source.makeCopy('Enrollment Database PRE-REPAIR ' + stamp, folder);
  return { id: copy.getId(), url: copy.getUrl(), name: copy.getName() };
}

function sha256Hex_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8);
  return bytes.map(function(byte) {
    const v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

