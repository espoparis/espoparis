import type {
  ApprovalStatus,
  AppRole,
  CourseLevel,
  CourseStatus,
  CourseType,
  EnrollmentStatus,
  MediaKind,
  Tables,
} from "@/lib/types/database";

export type ProfileRecord = Tables<"profiles">;
export type CourseRecord = Tables<"courses">;
export type CourseMediaRecord = Tables<"course_media">;
export type EnrollmentRecord = Tables<"enrollments">;
export type ReviewRecord = Tables<"course_reviews">;

export type DashboardLink = {
  href: string;
  label: string;
};

export type SessionProfile = {
  id: string;
  email: string;
  role: AppRole;
  approvalStatus: ApprovalStatus;
  fullName: string;
  avatarPath: string | null;
  bio: string;
};

export type CourseCardData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: CourseType;
  level: CourseLevel;
  status: CourseStatus;
  durationLabel: string;
  thumbnailUrl: string | null;
  teacherName: string;
  teacherAvatarUrl: string | null;
  reviewCount: number;
  averageRating: number | null;
};

export type PublicTeacherSummary = {
  id: string;
  fullName: string;
  bio: string;
  avatarUrl: string | null;
  publishedCourseCount: number;
};

export type CourseMediaItem = {
  id: string;
  courseId: string;
  kind: MediaKind;
  title: string;
  mimeType: string;
  sizeBytes: number;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
};

export type CourseDetailData = CourseCardData & {
  teacherId: string;
  media: CourseMediaItem[];
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    studentName: string;
    createdAt: string;
  }>;
};

export type EnrollmentRowData = {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseType: CourseType | null;
  courseLevel: CourseLevel | null;
  courseStatus: CourseStatus | null;
  studentId: string;
  studentName: string;
  status: EnrollmentStatus;
  appliedAt: string;
  reviewedAt: string | null;
};

export type StudentEnrollmentRowData = {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseThumbnailUrl: string | null;
  courseType: CourseType | null;
  courseLevel: CourseLevel | null;
  durationLabel: string | null;
  teacherName: string;
  mediaCount: number;
  status: EnrollmentStatus;
  appliedAt: string;
};
