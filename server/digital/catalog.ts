import type { AccessLevel, LibraryBook, PublishedBookMetadata, PublishedLessonMetadata, RecordedLesson, UserRole } from "../platform/types.ts";

export type DigitalRecordStatus = "draft" | "review" | "published" | "archived";

export type LibraryCatalogRecord = LibraryBook & {
  status: DigitalRecordStatus;
  coverFileId?: string;
  pdfFileId: string;
  updatedAt?: string;
};

export type LearningCatalogRecord = RecordedLesson & {
  courseTitle: string;
  academicYear: string;
  year: number;
  semester: number;
  status: DigitalRecordStatus;
  videoFileId?: string;
  audioFileId?: string;
  attachmentFileIds: string[];
  updatedAt?: string;
};

const allowedAccess = new Set<AccessLevel>(["public", "registered-free", "student-only", "paid"]);

const allowedTransitions: Record<DigitalRecordStatus, ReadonlySet<DigitalRecordStatus>> = {
  draft: new Set(["review", "archived"]),
  review: new Set(["draft", "published", "archived"]),
  published: new Set(["archived"]),
  archived: new Set(["draft"]),
};

export function canTransitionDigitalRecord(
  role: UserRole,
  kind: "library" | "learning",
  from: DigitalRecordStatus,
  to: DigitalRecordStatus,
) {
  if (!allowedTransitions[from]?.has(to)) return false;
  if (from === "published" || from === "archived" || to === "published" || to === "archived") return role === "admin";
  return kind === "library" ? role === "editor" || role === "admin" : role === "academic-officer" || role === "admin";
}

export function validateLibraryRecord(record: LibraryCatalogRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("Missing library record id.");
  if (!record.slug.trim()) errors.push("Missing library slug.");
  if (!record.title.trim()) errors.push("Missing library title.");
  if (!record.author.trim()) errors.push("Missing author.");
  if (!record.language.trim()) errors.push("Missing language.");
  if (!record.category.trim()) errors.push("Missing category.");
  if (!record.pdfFileId.trim()) errors.push("Missing PDF file id.");
  if (!allowedAccess.has(record.accessLevel)) errors.push("Invalid access level.");
  return errors;
}

export function validateLearningRecord(record: LearningCatalogRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("Missing lesson id.");
  if (!record.courseId.trim()) errors.push("Missing course id.");
  if (!record.courseTitle.trim()) errors.push("Missing course title.");
  if (!record.title.trim()) errors.push("Missing lesson title.");
  if (!record.academicYear.trim()) errors.push("Missing academic year.");
  if (!Number.isInteger(record.year) || record.year < 1 || record.year > 4) errors.push("Academic year level must be 1-4.");
  if (!Number.isInteger(record.semester) || record.semester < 1 || record.semester > 8) errors.push("Semester must be 1-8.");
  const expectedYear = Math.ceil(record.semester / 2);
  if (record.year !== expectedYear) errors.push("Year and semester do not match.");
  if (!record.videoFileId && !record.audioFileId && record.attachmentFileIds.length === 0) errors.push("Lesson has no digital asset.");
  if (!allowedAccess.has(record.accessLevel)) errors.push("Invalid access level.");
  return errors;
}

export function publishedBooks(records: LibraryCatalogRecord[]): PublishedBookMetadata[] {
  return records.filter((r) => r.status === "published" && validateLibraryRecord(r).length === 0).map((r) => ({
    id: r.id, slug: r.slug, title: r.title, author: r.author, description: r.description, language: r.language,
    category: r.category, publicationYear: r.publicationYear, pageCount: r.pageCount,
    accessLevel: r.accessLevel, published: true,
  }));
}

export function publishedLessons(records: LearningCatalogRecord[], courseId?: string): PublishedLessonMetadata[] {
  return records.filter((r) => r.status === "published" && (!courseId || r.courseId === courseId) && validateLearningRecord(r).length === 0)
    .map((r) => ({ id: r.id, courseId: r.courseId, courseTitle: r.courseTitle, title: r.title, description: r.description,
      academicYear: r.academicYear, year: r.year, semester: r.semester, order: r.order,
      accessLevel: r.accessLevel, published: true }));
}
