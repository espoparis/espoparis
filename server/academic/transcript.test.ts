import test from "node:test";
import assert from "node:assert/strict";
import { buildTranscript, calculatePublishedAverage } from "./transcript.ts";

test("average uses only published numeric grades", () => {
  const avg = calculatePublishedAverage([
    { enrollmentId:"e1", courseOfferingId:"c1", scale:"points", earned:80, possible:100, published:true },
    { enrollmentId:"e1", courseOfferingId:"c2", scale:"points", earned:45, possible:50, published:true },
    { enrollmentId:"e1", courseOfferingId:"c3", scale:"points", earned:0, possible:100, published:false },
  ]);
  assert.equal(avg, 85);
});

test("transcript preserves academic identity and history", () => {
  const generatedAt = new Date("2026-09-05T00:00:00Z");
  const tx = buildTranscript({ enrollmentId:"e1", studentNumber:"AIC-2026-0007", studentName:"Test Student", academicYear:"2026-2027", yearLevel:1, semester:1, standing:"passed", termAverage:88.5, courses:[], generatedAt });
  assert.equal(tx.studentNumber, "AIC-2026-0007");
  assert.equal(tx.academicYear, "2026-2027");
  assert.equal(tx.generatedAt, generatedAt);
});
