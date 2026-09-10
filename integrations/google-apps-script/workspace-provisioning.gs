/**
 * ESPO Paris academic workspace provisioning.
 * Idempotently prepares the Google Sheets operational store used by the Teacher/Admin portals.
 * Run only from an administrator-owned Apps Script project.
 */
function provisionAcademicWorkspace() {
  var spreadsheet = ensureAcademicSheets_();
  var headers = academicHeaders_();

  Object.keys(headers).forEach(function(name) {
    var sheet = spreadsheet.getSheetByName(name);
    if (!sheet) throw new Error("Provisioning failed to create: " + name);
    ensureCanonicalHeader_(sheet, headers[name]);
    styleAcademicSheet_(sheet, headers[name].length);
  });

  configureAcademicValidations_(spreadsheet);
  protectAcademicOperationalSheets_(spreadsheet);

  return {
    spreadsheetId: spreadsheet.getId(),
    sheets: Object.keys(headers),
    status: "ready",
  };
}

function ensureCanonicalHeader_(sheet, headers) {
  var current = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  var empty = current.every(function(value) { return !String(value || "").trim(); });
  if (empty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  var missing = headers.filter(function(header) { return current.indexOf(header) < 0; });
  if (missing.length) throw new Error(sheet.getName() + " is missing canonical headers: " + missing.join(", "));
}

function styleAcademicSheet_(sheet, columnCount) {
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, columnCount).setFontWeight("bold").setBackground("#0f4738").setFontColor("#ffffff");
  sheet.autoResizeColumns(1, columnCount);
}

function validationFromList_(values) {
  return SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
}

function configureAcademicValidations_(spreadsheet) {
  var offering = spreadsheet.getSheetByName(ACADEMIC_SHEETS.OFFERINGS);
  var assessments = spreadsheet.getSheetByName(ACADEMIC_SHEETS.ASSESSMENTS);
  var grades = spreadsheet.getSheetByName(ACADEMIC_SHEETS.GRADES);
  var attendance = spreadsheet.getSheetByName(ACADEMIC_SHEETS.ATTENDANCE);
  var staff = spreadsheet.getSheetByName(ACADEMIC_SHEETS.STAFF);

  offering.getRange("F2:F").setDataValidation(validationFromList_(["draft", "active", "closed", "archived"]));
  assessments.getRange("G2:G").setDataValidation(validationFromList_(["TRUE", "FALSE"]));
  grades.getRange("G2:G").setDataValidation(validationFromList_(["draft", "submitted", "returned", "approved", "published"]));
  attendance.getRange("F2:F").setDataValidation(validationFromList_(["present", "absent", "excused", "late"]));
  staff.getRange("B2:B").setDataValidation(validationFromList_(["teacher", "academic-officer", "finance", "editor", "admin"]));
  staff.getRange("C2:C").setDataValidation(validationFromList_(["TRUE", "FALSE"]));
}

function protectAcademicOperationalSheets_(spreadsheet) {
  [ACADEMIC_SHEETS.GRADES, ACADEMIC_SHEETS.ATTENDANCE, ACADEMIC_SHEETS.AUDIT].forEach(function(name) {
    var sheet = spreadsheet.getSheetByName(name);
    var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    if (protections.length) return;
    var protection = sheet.protect().setDescription("Managed by ESPO Portal / Apps Script. Do not edit directly.");
    protection.setWarningOnly(true);
  });
}
