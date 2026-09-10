import { recommendNextTerm, type AcademicStanding, type ProgressionDecision } from "./records.ts";

export type ProgressionCandidate = {
  enrollmentId: string;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  standing: AcademicStanding;
  allRequiredGradesPublished: boolean;
  attendanceComplete: boolean;
};

export type ProgressionReadiness =
  | { ready: true; recommendation: ReturnType<typeof recommendNextTerm> }
  | { ready: false; reason: "grades-not-published" | "attendance-incomplete" | "standing-not-eligible" };

export function evaluateProgressionReadiness(candidate: ProgressionCandidate): ProgressionReadiness {
  if (!candidate.allRequiredGradesPublished) return { ready:false, reason:"grades-not-published" };
  if (!candidate.attendanceComplete) return { ready:false, reason:"attendance-incomplete" };
  const recommendation = recommendNextTerm(candidate);
  if (recommendation.decision === "hold") return { ready:false, reason:"standing-not-eligible" };
  return { ready:true, recommendation };
}

export function approveProgression(input: {
  candidate: ProgressionCandidate;
  approvedByUserId: string;
  approvedAt?: Date;
  overrideDecision?: ProgressionDecision["decision"];
  reason?: string;
}): ProgressionDecision {
  const readiness = evaluateProgressionReadiness(input.candidate);
  if (!readiness.ready && !input.overrideDecision) throw new Error(`Progression not ready: ${readiness.reason}`);
  const recommendation = readiness.ready ? readiness.recommendation : { decision: input.overrideDecision! };
  const decision = input.overrideDecision ?? recommendation.decision;
  const nextSemester = decision === "promote" && "nextSemester" in recommendation ? recommendation.nextSemester : undefined;
  const nextYearLevel = decision === "promote" && "nextYearLevel" in recommendation ? recommendation.nextYearLevel : undefined;
  return {
    enrollmentId: input.candidate.enrollmentId,
    fromYearLevel: input.candidate.yearLevel,
    fromSemester: input.candidate.semester,
    nextSemester, nextYearLevel, decision,
    approvedByUserId: input.approvedByUserId,
    approvedAt: input.approvedAt ?? new Date(),
    reason: input.reason,
  };
}
