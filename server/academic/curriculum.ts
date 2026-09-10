export type CurriculumStatus = "draft" | "active" | "archived";
export type SubjectStatus = "active" | "inactive";

export type CurriculumSubject = {
  id: string;
  code: string;
  name: string;
  description?: string;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  displayOrder: number;
  status: SubjectStatus;
};

export type CurriculumVersion = {
  id: string;
  academicYear: string;
  label: string;
  status: CurriculumStatus;
  subjects: CurriculumSubject[];
  createdAt: string;
  activatedAt?: string;
  archivedAt?: string;
};

export type CurriculumMutation =
  | { type: "add-subject"; subject: CurriculumSubject }
  | { type: "update-subject"; subjectId: string; patch: Partial<Omit<CurriculumSubject, "id">> }
  | { type: "deactivate-subject"; subjectId: string }
  | { type: "reorder-subject"; subjectId: string; displayOrder: number };

export function validateAcademicYear(value: string) {
  return /^20\d{2}-20\d{2}$/.test(value);
}

export function canEditCurriculum(version: CurriculumVersion) {
  return version.status === "draft";
}

export function validateCurriculum(version: CurriculumVersion): string[] {
  const issues: string[] = [];
  if (!validateAcademicYear(version.academicYear)) issues.push("invalid_academic_year");
  if (!version.label.trim()) issues.push("missing_label");

  const ids = new Set<string>();
  const codes = new Set<string>();
  for (const subject of version.subjects) {
    if (!subject.id.trim()) issues.push("missing_subject_id");
    if (ids.has(subject.id)) issues.push(`duplicate_subject_id:${subject.id}`);
    ids.add(subject.id);

    const normalizedCode = subject.code.trim().toLowerCase();
    if (!normalizedCode) issues.push(`missing_subject_code:${subject.id}`);
    if (codes.has(normalizedCode)) issues.push(`duplicate_subject_code:${subject.code}`);
    codes.add(normalizedCode);

    if (!subject.name.trim()) issues.push(`missing_subject_name:${subject.id}`);
    if (subject.semester < 1 || subject.semester > 8) issues.push(`invalid_semester:${subject.id}`);
    const expectedYear = Math.ceil(subject.semester / 2);
    if (subject.yearLevel !== expectedYear) issues.push(`year_semester_mismatch:${subject.id}`);
    if (!Number.isInteger(subject.displayOrder) || subject.displayOrder < 0) issues.push(`invalid_display_order:${subject.id}`);
  }
  return issues;
}

export function applyCurriculumMutation(version: CurriculumVersion, mutation: CurriculumMutation): CurriculumVersion {
  if (!canEditCurriculum(version)) throw new Error("curriculum_version_is_immutable");

  let subjects = [...version.subjects];
  if (mutation.type === "add-subject") {
    if (subjects.some((subject) => subject.id === mutation.subject.id)) throw new Error("duplicate_subject_id");
    subjects.push(mutation.subject);
  }

  if (mutation.type === "update-subject") {
    let found = false;
    subjects = subjects.map((subject) => {
      if (subject.id !== mutation.subjectId) return subject;
      found = true;
      return { ...subject, ...mutation.patch };
    });
    if (!found) throw new Error("subject_not_found");
  }

  if (mutation.type === "deactivate-subject") {
    let found = false;
    subjects = subjects.map((subject) => {
      if (subject.id !== mutation.subjectId) return subject;
      found = true;
      return { ...subject, status: "inactive" as const };
    });
    if (!found) throw new Error("subject_not_found");
  }

  if (mutation.type === "reorder-subject") {
    let found = false;
    subjects = subjects.map((subject) => {
      if (subject.id !== mutation.subjectId) return subject;
      found = true;
      return { ...subject, displayOrder: mutation.displayOrder };
    });
    if (!found) throw new Error("subject_not_found");
  }

  return { ...version, subjects };
}

export function activateCurriculum(version: CurriculumVersion, activatedAt: string): CurriculumVersion {
  if (version.status !== "draft") throw new Error("only_draft_can_be_activated");
  const issues = validateCurriculum(version);
  if (issues.length) throw new Error(`curriculum_invalid:${issues.join(",")}`);
  return { ...version, status: "active", activatedAt };
}

export function cloneCurriculumForNextYear(
  version: CurriculumVersion,
  nextAcademicYear: string,
  nextId: string,
  createdAt: string,
): CurriculumVersion {
  if (!validateAcademicYear(nextAcademicYear)) throw new Error("invalid_academic_year");
  return {
    id: nextId,
    academicYear: nextAcademicYear,
    label: `${version.label} ${nextAcademicYear}`,
    status: "draft",
    createdAt,
    subjects: version.subjects.map((subject) => ({ ...subject })),
  };
}
