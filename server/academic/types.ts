import type { AccessLevel } from "@/server/platform/types";

export type EnrollmentStatus = "pending" | "active" | "paused" | "completed" | "withdrawn";
export type EnrollmentSource = "admissions" | "admin" | "import";
export type LearningTrack = "academic-program" | "standalone-course" | "public-learning";
export type DeliveryChannel = "classroom-live" | "portal-recording" | "portal-resource";

export type AcademicEnrollment = {
  id: string;
  userId: string;
  academicYear: string;
  programId: string;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  status: EnrollmentStatus;
  source: EnrollmentSource;
  classroomCourseIds?: string[];
  startsAt?: Date;
  endsAt?: Date;
};

export type CourseOffering = {
  id: string;
  courseId: string;
  academicYear: string;
  semester: number;
  accessLevel: AccessLevel;
  learningTrack: LearningTrack;
  classroomCourseId?: string;
  purchasable: boolean;
  priceMinor?: number;
  currency?: string;
  published: boolean;
};

export type LessonDelivery = {
  lessonId: string;
  channels: DeliveryChannel[];
  classroomPostUrl?: string;
  recordingAssetId?: string;
  liveMeetingUrl?: string;
};
