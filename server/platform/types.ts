export type AccessLevel = "public" | "registered-free" | "student-only" | "paid";

export type UserRole =
  | "visitor"
  | "member"
  | "student"
  | "teacher"
  | "academic-officer"
  | "finance"
  | "editor"
  | "admin";

export type AssetKind = "pdf" | "cover" | "video" | "audio" | "attachment";

export type ResourceKind = "book" | "course" | "lesson";

export type StoredAsset = {
  id: string;
  kind: AssetKind;
  storageProvider: "google-drive" | "object-storage";
  storageKey: string;
  mimeType: string;
  sizeBytes?: number;
  downloadAllowed: boolean;
};

export type LibraryBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  description?: string;
  language: string;
  category: string;
  publicationYear?: number;
  pageCount?: number;
  coverAssetId?: string;
  pdfAssetId: string;
  accessLevel: AccessLevel;
  published: boolean;
};

/** Public catalog metadata deliberately excludes storage identifiers. */
export type PublishedBookMetadata = Omit<LibraryBook, "coverAssetId" | "pdfAssetId">;

export type RecordedLesson = {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  videoAssetId?: string;
  audioAssetId?: string;
  attachmentAssetIds: string[];
  accessLevel: AccessLevel;
  published: boolean;
};

/** Public lesson metadata deliberately excludes private asset identifiers. */
export type PublishedLessonMetadata = Omit<
  RecordedLesson,
  "videoAssetId" | "audioAssetId" | "attachmentAssetIds"
> & {
  courseTitle: string;
  academicYear: string;
  year: number;
  semester: number;
};

export type EntitlementSource = "enrollment" | "purchase" | "grant";

export type Entitlement = {
  userId: string;
  resourceKind: ResourceKind;
  resourceId: string;
  source: EntitlementSource;
  expiresAt?: Date;
};

export type Viewer = {
  userId?: string;
  role: UserRole;
  authenticated: boolean;
  entitlementResourceIds?: string[];
};

export type LessonProgress = {
  userId: string;
  lessonId: string;
  completed: boolean;
  positionSeconds?: number;
  updatedAt: Date;
};
