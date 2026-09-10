import { randomUUID } from "node:crypto";
import { callAppsScript } from "./apps-script-client";

export type EnrollmentAuditResult = {
  total: number;
  missingNames: number;
  missingCentralRecords: number;
  unknownFolders: number;
  duplicateEmails: number;
  blockers: Array<{ type: string; message: string; email?: string; applicationId?: string }>;
  proposals: unknown[];
  auditToken: string;
  canApply: boolean;
};

export async function auditLiveEnrollment(input: { url: string; secret: string; actorEmail: string }) {
  return callAppsScript<{}, { ok: boolean; result?: EnrollmentAuditResult; error?: string }>({
    url: input.url, secret: input.secret, action: "admin.enrollment.audit", data: {}, nonce: randomUUID(), actor: { email: input.actorEmail, role: "admin" },
  });
}

export async function applyLiveEnrollmentRepair(input: { url: string; secret: string; actorEmail: string; confirmation: string; auditToken: string }) {
  if (input.confirmation !== "APPLY-ENROLLMENT-REPAIR") throw new Error("Explicit repair confirmation is required.");
  if (!input.auditToken.trim()) throw new Error("A fresh enrollment audit token is required before repair.");
  return callAppsScript<{ confirmation: string; auditToken: string }, { ok: boolean; result?: unknown; error?: string }>({
    url: input.url,
    secret: input.secret,
    action: "admin.enrollment.repair",
    data: { confirmation: input.confirmation, auditToken: input.auditToken },
    nonce: randomUUID(),
    actor: { email: input.actorEmail, role: "admin" },
  });
}
