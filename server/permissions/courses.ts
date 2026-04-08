import type { SessionProfile } from "@/lib/types/domain";
import { getCourseStorageAssets } from "@/server/repositories/courses";

type ManagedCourseAssets = {
  course: {
    id: string;
    teacher_id: string;
    thumbnail_path: string | null;
  };
  media: Array<{
    storage_path: string;
    thumbnail_path: string | null;
  }>;
};

export class CourseAccessError extends Error {
  status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = "CourseAccessError";
    this.status = status;
  }
}

export async function requireManagedCourse(
  profile: SessionProfile,
  courseId: string
): Promise<ManagedCourseAssets> {
  if (profile.approvalStatus !== "approved" || !["teacher", "admin"].includes(profile.role)) {
    throw new CourseAccessError("You are not allowed to manage this course.", 403);
  }

  const assets = await getCourseStorageAssets(courseId);

  if (!assets.course) {
    throw new CourseAccessError("Course not found.", 404);
  }

  if (profile.role !== "admin" && assets.course.teacher_id !== profile.id) {
    throw new CourseAccessError("You do not own this course.", 403);
  }

  return {
    course: assets.course,
    media: assets.media,
  };
}
