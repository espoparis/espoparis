import test from "node:test";
import assert from "node:assert/strict";
import {
  buildApplicationId,
  normalizeEnrollmentResponseRow,
  parseApplicationSequence,
  toCentralEnrollmentRow,
} from "./enrollment-source.ts";

test("normalizes a multilingual form response by canonical column position", () => {
  const row = [
    "9/3/2026 0:25:58",
    " Student@Example.COM ",
    "ليث احمد كاظم",
    "5/26/1988",
    "Phd",
    "هندسة مدنية",
    "https://drive.google.com/open?id=cert",
    "دراسة سابقة",
    "العربية",
    "https://drive.google.com/open?id=photo",
    "https://drive.google.com/open?id=id",
    "بريطانيا ليفربول",
    "+447411003803",
  ];

  const result = normalizeEnrollmentResponseRow(row, "Arabic");
  assert.equal(result.fullName, "ليث احمد كاظم");
  assert.equal(result.email, "student@example.com");
  assert.equal(result.phone, "+447411003803");
});

test("rejects a row when the full name is missing instead of silently creating Unknown Student", () => {
  const row = ["date", "student@example.com", "", "", "", "", "", "", "", "", "", "", ""];
  assert.throws(() => normalizeEnrollmentResponseRow(row, "English"), /missing the applicant full name/);
});

test("creates a full central database row without dropping form fields", () => {
  const submission = normalizeEnrollmentResponseRow(
    ["date", "student@example.com", "Student Name", "dob", "level", "degree", "certificate", "hawza", "English", "photo", "id", "Paris", "+33123"],
    "English",
  );
  const central = toCentralEnrollmentRow({ applicationId: "AIC-2026-0009", submission, studentFolderUrl: "folder" });
  assert.equal(central.length, 18);
  assert.equal(central[3], "Student Name");
  assert.equal(central[4], "student@example.com");
  assert.equal(central[16], "folder");
});

test("application IDs retain the existing AIC sequence format", () => {
  assert.equal(buildApplicationId(9), "AIC-2026-0009");
  assert.deepEqual(parseApplicationSequence("AIC-2026-0008"), { year: 2026, sequence: 8 });
  assert.equal(parseApplicationSequence("ESPO-2026-0008"), null);
});
