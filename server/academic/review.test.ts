import assert from 'node:assert/strict';
import test from 'node:test';
import { canPublishGradeBatch, calculateSemesterAverage, reviewStudentGrades } from './review.ts';

const assessments = [
  { id:'mid', courseOfferingId:'c1', title:'Midterm', kind:'midterm' as const, maxScore:40, weightPercent:40, active:true },
  { id:'final', courseOfferingId:'c1', title:'Final', kind:'final' as const, maxScore:60, weightPercent:60, active:true },
];
const grade = (assessmentId:string, score:number|null, status:'draft'|'submitted'|'approved'|'published'|'returned'='submitted') => ({ enrollmentId:'e1', assessmentId, score, status, enteredByUserId:'t1', enteredAt:new Date() });

test('review marks a complete submitted grade set ready', () => {
  const result = reviewStudentGrades(assessments, { enrollmentId:'e1', studentName:'Student', grades:[grade('mid',32), grade('final',48)] });
  assert.equal(result.ready, true);
  assert.equal(result.earnedPercent, 80);
});

test('review blocks missing assessment', () => {
  const result = reviewStudentGrades(assessments, { enrollmentId:'e1', studentName:'Student', grades:[grade('mid',32)] });
  assert.equal(result.ready, false);
  assert.deepEqual(result.missingAssessmentIds, ['final']);
});

test('review blocks draft grades', () => {
  const result = reviewStudentGrades(assessments, { enrollmentId:'e1', studentName:'Student', grades:[grade('mid',32,'draft'), grade('final',48)] });
  assert.equal(result.ready, false);
  assert.ok(result.issues.includes('unsubmitted-grades'));
});

test('batch publishing requires every student ready', () => {
  assert.equal(canPublishGradeBatch([{enrollmentId:'1', ready:true, earnedPercent:80, missingAssessmentIds:[], issues:[]}]), true);
  assert.equal(canPublishGradeBatch([{enrollmentId:'1', ready:true, earnedPercent:80, missingAssessmentIds:[], issues:[]},{enrollmentId:'2', ready:false, earnedPercent:null, missingAssessmentIds:['x'], issues:['missing-assessments']}]), false);
});

test('semester average ignores missing courses', () => {
  assert.equal(calculateSemesterAverage([80,90,null,undefined]), 85);
  assert.equal(calculateSemesterAverage([null,undefined]), null);
});
