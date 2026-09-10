import test from "node:test";
import assert from "node:assert/strict";
import { buildProductionGates, canActivateAcademicWrites, canActivateStudentAccountLinking } from "./readiness.ts";

const allReady = {
  enrollmentAuditClean: true,
  enrollmentRepairVerified: true,
  appsScriptBridgeConfigured: true,
  authConfigured: true,
  staffAccessConfigured: true,
  academicSheetsConfigured: true,
  backupConfirmed: true,
  addressConfirmed: false,
  legalNameConfirmed: false,
};

test("student linking requires the five identity/enrollment gates but not unconfirmed public address", () => {
  const gates = buildProductionGates(allReady);
  assert.equal(canActivateStudentAccountLinking(gates), true);
});

test("student linking remains blocked before verified enrollment repair", () => {
  const gates = buildProductionGates({ ...allReady, enrollmentRepairVerified: false });
  assert.equal(canActivateStudentAccountLinking(gates), false);
});

test("academic writes require staff authorization and academic storage", () => {
  assert.equal(canActivateAcademicWrites(buildProductionGates(allReady)), true);
  assert.equal(canActivateAcademicWrites(buildProductionGates({ ...allReady, staffAccessConfigured: false })), false);
  assert.equal(canActivateAcademicWrites(buildProductionGates({ ...allReady, academicSheetsConfigured: false })), false);
});
