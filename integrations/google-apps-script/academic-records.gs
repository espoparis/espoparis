/**
 * ESPO Paris academic records service.
 * Google Sheets is the low-cost operational store; this Apps Script file is the controlled write boundary.
 * Teachers and students must never receive edit access to the backing sheets.
 *
 * Required Script Properties:
 * ACADEMIC_SPREADSHEET_ID
 */
const ACADEMIC_SHEETS = Object.freeze({
  OFFERINGS: "Course Offerings",
  ASSESSMENTS: "Assessments",
  GRADES: "Gradebook",
  ATTENDANCE: "Attendance",
  STAFF: "Staff Access",
  AUDIT: "Academic Audit Log",
});

function academicSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty("ACADEMIC_SPREADSHEET_ID");
  if (!id) throw new Error("ACADEMIC_SPREADSHEET_ID is not configured.");
  return SpreadsheetApp.openById(id);
}

function academicHeaders_() {
  return {
    [ACADEMIC_SHEETS.OFFERINGS]: ["Offering Id", "Course Id", "Academic Year", "Semester", "Teacher Email", "Status"],
    [ACADEMIC_SHEETS.ASSESSMENTS]: ["Assessment Id", "Offering Id", "Title", "Kind", "Max Score", "Weight %", "Active"],
    [ACADEMIC_SHEETS.GRADES]: ["Grade Key", "Enrollment Id", "AIC Id", "Offering Id", "Assessment Id", "Score", "Status", "Entered By", "Entered At", "Approved By", "Approved At", "Published At", "Note"],
    [ACADEMIC_SHEETS.ATTENDANCE]: ["Attendance Key", "Enrollment Id", "AIC Id", "Offering Id", "Lesson Id", "Status", "Recorded By", "Recorded At", "Source"],
    [ACADEMIC_SHEETS.STAFF]: ["Email", "Role", "Active", "Allowed Offering Ids"],
    [ACADEMIC_SHEETS.AUDIT]: ["Timestamp", "Actor", "Action", "Resource Type", "Resource Id", "Before", "After"],
  };
}

function ensureAcademicSheets_() {
  var spreadsheet = academicSpreadsheet_();
  var headers = academicHeaders_();
  Object.keys(headers).forEach(function(name) {
    var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers[name].length).setValues([headers[name]]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  });
  return spreadsheet;
}

function normalizeAcademicEmail_(value) {
  return String(value || "").trim().toLowerCase();
}

function splitOfferingIds_(value) {
  return String(value || "").split(",").map(function(v) { return v.trim(); }).filter(Boolean);
}

function staffAccessFor_(spreadsheet, email) {
  var sheet = spreadsheet.getSheetByName(ACADEMIC_SHEETS.STAFF);
  if (!sheet) throw new Error("Staff Access sheet is not initialized.");
  email = normalizeAcademicEmail_(email);
  var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getDisplayValues() : [];
  for (var i = 0; i < rows.length; i++) {
    if (normalizeAcademicEmail_(rows[i][0]) !== email) continue;
    return {
      email: email,
      role: String(rows[i][1] || "").trim(),
      active: String(rows[i][2] || "").trim().toLowerCase() === "true",
      offeringIds: splitOfferingIds_(rows[i][3]),
    };
  }
  return null;
}

function assertAcademicPermission_(spreadsheet, actorEmail, action, offeringId) {
  var staff = staffAccessFor_(spreadsheet, actorEmail);
  if (!staff || !staff.active) throw new Error("Academic staff access is not active for this account.");
  if (staff.role === "admin") return staff;
  if (staff.role === "academic-officer") {
    if (["grade.approve", "grade.return", "grade.publish"].indexOf(action) >= 0) return staff;
    throw new Error("Academic officer is not allowed to perform this action.");
  }
  if (staff.role === "teacher") {
    var teacherAction = ["grade.save-draft", "grade.submit", "attendance.record"].indexOf(action) >= 0;
    if (teacherAction && staff.offeringIds.indexOf(offeringId) >= 0) return staff;
    throw new Error("Teacher is not assigned to this course offering or action.");
  }
  throw new Error("Unsupported academic role.");
}

function assessmentById_(spreadsheet, assessmentId) {
  var sheet = spreadsheet.getSheetByName(ACADEMIC_SHEETS.ASSESSMENTS);
  var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getDisplayValues() : [];
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === assessmentId) {
      return { id: rows[i][0], offeringId: rows[i][1], maxScore: Number(rows[i][4]), active: String(rows[i][6]).toLowerCase() !== "false" };
    }
  }
  throw new Error("Assessment not found: " + assessmentId);
}

function gradeKey_(enrollmentId, assessmentId) {
  enrollmentId = String(enrollmentId || "").trim();
  assessmentId = String(assessmentId || "").trim();
  if (!enrollmentId || !assessmentId) throw new Error("Grade identity fields are required.");
  return enrollmentId + "::" + assessmentId;
}

function findKeyRow_(sheet, key, column) {
  if (sheet.getLastRow() <= 1) return null;
  var values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getDisplayValues().flat();
  for (var i = 0; i < values.length; i++) if (String(values[i]).trim() === key) return i + 2;
  return null;
}

function auditAcademic_(spreadsheet, actor, action, resourceType, resourceId, beforeValue, afterValue) {
  spreadsheet.getSheetByName(ACADEMIC_SHEETS.AUDIT).appendRow([
    new Date(), actor, action, resourceType, resourceId,
    JSON.stringify(beforeValue || null), JSON.stringify(afterValue || null)
  ]);
}

function saveGradeDraft_(payload, actorEmail) {
  var spreadsheet = ensureAcademicSheets_();
  var assessment = assessmentById_(spreadsheet, payload.assessmentId);
  if (assessment.offeringId !== payload.offeringId) throw new Error("Assessment does not belong to the requested offering.");
  assertAcademicPermission_(spreadsheet, actorEmail, "grade.save-draft", payload.offeringId);
  var score = payload.score === null || payload.score === "" ? "" : Number(payload.score);
  if (score !== "" && (!isFinite(score) || score < 0 || score > assessment.maxScore)) throw new Error("Score is outside assessment bounds.");

  var sheet = spreadsheet.getSheetByName(ACADEMIC_SHEETS.GRADES);
  var key = gradeKey_(payload.enrollmentId, payload.assessmentId);
  var rowNumber = findKeyRow_(sheet, key, 1);
  var beforeValue = rowNumber ? sheet.getRange(rowNumber, 1, 1, 13).getDisplayValues()[0] : null;
  var now = new Date();
  var row = [key, payload.enrollmentId, payload.aicId, payload.offeringId, payload.assessmentId, score, "draft", actorEmail, now, "", "", "", payload.note || ""];
  if (rowNumber) sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
  auditAcademic_(spreadsheet, actorEmail, "grade.save-draft", "grade", key, beforeValue, row);
  return { key: key, status: "draft" };
}

function transitionGrade_(payload, actorEmail, targetStatus) {
  var spreadsheet = ensureAcademicSheets_();
  var sheet = spreadsheet.getSheetByName(ACADEMIC_SHEETS.GRADES);
  var key = gradeKey_(payload.enrollmentId, payload.assessmentId);
  var rowNumber = findKeyRow_(sheet, key, 1);
  if (!rowNumber) throw new Error("Grade record not found.");
  var before = sheet.getRange(rowNumber, 1, 1, 13).getDisplayValues()[0];
  var offeringId = before[3];
  var current = before[6];
  var action = "grade." + targetStatus;
  assertAcademicPermission_(spreadsheet, actorEmail, action, offeringId);

  var transitions = {
    draft: { submitted: true },
    returned: { submitted: true },
    submitted: { approved: true, returned: true },
    approved: { published: true, returned: true },
    published: { returned: true },
  };
  if (!transitions[current] || !transitions[current][targetStatus]) throw new Error("Invalid grade status transition: " + current + " -> " + targetStatus);
  if (targetStatus === "submitted" && before[5] === "") throw new Error("Cannot submit an empty grade.");

  sheet.getRange(rowNumber, 7).setValue(targetStatus);
  if (targetStatus === "approved") {
    sheet.getRange(rowNumber, 10).setValue(actorEmail);
    sheet.getRange(rowNumber, 11).setValue(new Date());
  }
  if (targetStatus === "published") sheet.getRange(rowNumber, 12).setValue(new Date());
  if (targetStatus === "returned" && payload.note) sheet.getRange(rowNumber, 13).setValue(payload.note);
  var after = sheet.getRange(rowNumber, 1, 1, 13).getDisplayValues()[0];
  auditAcademic_(spreadsheet, actorEmail, action, "grade", key, before, after);
  return { key: key, status: targetStatus };
}

function attendanceKey_(enrollmentId, lessonId) {
  if (!enrollmentId || !lessonId) throw new Error("Attendance identity fields are required.");
  return String(enrollmentId).trim() + "::" + String(lessonId).trim();
}

function recordAttendance_(payload, actorEmail) {
  var allowed = { present: true, absent: true, excused: true, late: true };
  if (!allowed[payload.status]) throw new Error("Invalid attendance status.");
  var spreadsheet = ensureAcademicSheets_();
  assertAcademicPermission_(spreadsheet, actorEmail, "attendance.record", payload.offeringId);
  var sheet = spreadsheet.getSheetByName(ACADEMIC_SHEETS.ATTENDANCE);
  var key = attendanceKey_(payload.enrollmentId, payload.lessonId);
  var rowNumber = findKeyRow_(sheet, key, 1);
  var before = rowNumber ? sheet.getRange(rowNumber, 1, 1, 9).getDisplayValues()[0] : null;
  var row = [key, payload.enrollmentId, payload.aicId, payload.offeringId, payload.lessonId, payload.status, actorEmail, new Date(), payload.source || "teacher-portal"];
  if (rowNumber) sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
  auditAcademic_(spreadsheet, actorEmail, "attendance.record", "attendance", key, before, row);
  return { key: key, status: payload.status };
}

function publishedAcademicSnapshot_(aicId) {
  var spreadsheet = ensureAcademicSheets_();
  var gradesSheet = spreadsheet.getSheetByName(ACADEMIC_SHEETS.GRADES);
  var attendanceSheet = spreadsheet.getSheetByName(ACADEMIC_SHEETS.ATTENDANCE);
  var grades = gradesSheet.getLastRow() > 1 ? gradesSheet.getRange(2, 1, gradesSheet.getLastRow() - 1, 13).getDisplayValues() : [];
  var attendance = attendanceSheet.getLastRow() > 1 ? attendanceSheet.getRange(2, 1, attendanceSheet.getLastRow() - 1, 9).getDisplayValues() : [];
  return {
    grades: grades.filter(function(row) { return row[2] === aicId && row[6] === "published"; }).map(function(row) {
      return { offeringId: row[3], assessmentId: row[4], score: row[5], status: row[6], publishedAt: row[11] };
    }),
    attendance: attendance.filter(function(row) { return row[2] === aicId; }).map(function(row) {
      return { offeringId: row[3], lessonId: row[4], status: row[5], recordedAt: row[7] };
    }),
  };
}
