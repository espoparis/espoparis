# Phase 16 — Academic Records, Grades, Attendance and Progression

## Purpose
This phase defines how the Student Portal becomes an academic record surface without replacing Google Classroom. Classroom remains the day-to-day teaching and assignment space. The ESPO portal becomes the institutional view of enrollment, current level, subjects, recordings, attendance summaries, published grades, averages and progression history.

## One source of truth
The existing central Enrollment database remains the authoritative admissions/student registry. The website must link a verified website account to that existing record rather than creating a second student identity. The academic/application number such as `AIC-2026-0001` remains the human-facing institutional identifier. The website may also maintain an internal opaque user UUID for security and relational integrity.

## Academic record model
Each active enrollment points to one academic year, year level and semester. Subjects shown in the portal are derived from that enrollment and the approved academic-program configuration. Course grades, attendance entries and term summaries are separate records linked by enrollment ID and course/lesson IDs. Grades remain hidden until explicitly published by authorized staff.

## Progression rule
Progression must be approval-based, not blindly automatic. The system can calculate a recommendation after final grades/attendance are complete, but an authorized academic administrator confirms promotion, repetition, hold or program completion. Once approved, the next enrollment/term is created and the portal automatically changes the student's visible subjects and access rights.

Example: Year 1 / Semester 2 -> approved promotion -> Year 2 / Semester 3. The student keeps historical records from the previous year while current-course access moves to the new term.

## Attendance
Attendance can later be imported from Google Meet/Classroom or entered by authorized staff. Store one attendance event per lesson with present, absent, excused or late status. The portal should expose a student summary, while detailed administrative editing belongs to the admin system.

## Grades and averages
Do not hard-code one grading scale before academic policy is confirmed. The data model supports percentage, points, pass/fail and letter scales. A term average is published only when the academic office approves the calculation policy. Credits are deliberately not implemented because the current academic guide has not confirmed a credit-hour system.

## Google Classroom relationship
Classroom is not the authoritative academic record. It may supply assignments, live-class links, classroom course IDs and eventually attendance/grade imports. Imported values are staged and reviewed before becoming institutional grades in the portal.

## Data pipeline to audit later
Forms -> language-specific response sheets -> Central Enrollment Database -> AIC ID -> verified website account -> active academic enrollment -> courses/recordings/grades/attendance.

The known issue where the central database sometimes receives email/details but not the student's name must be repaired at the pipeline/source-mapping level before production account matching is enabled. Do not patch only the portal display.

## Annual operating procedure
1. Close the current term and freeze/publish approved grades.
2. Generate progression recommendations.
3. Academic administration reviews exceptions and confirms decisions.
4. Create/activate the next term enrollment for promoted students.
5. Course access updates from the new enrollment automatically.
6. Previous grades, attendance and course history remain read-only in the student archive.
7. Classroom membership can then be synchronized to the new courses.

## Handover principle
An incoming IT administrator should never have to infer student status from Classroom membership or Drive folders. The central Enrollment record and approved progression decision are the source for portal access; Classroom and Drive are connected services, not the student registry.
