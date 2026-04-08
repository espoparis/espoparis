import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { SectionBlock } from "@/components/layout/section-block";
import { CourseEditorForm } from "@/features/courses/components/course-editor-form";
import { CourseMediaManager } from "@/features/courses/components/course-media-manager";
import { CourseThumbnailUploader } from "@/features/courses/components/course-thumbnail-uploader";
import { deleteCourseAction } from "@/features/courses/actions";
import { requireApprovedRole } from "@/server/auth/session";
import { getCourseDetail } from "@/server/queries/courses";
import { localizePath } from "@/lib/constants/app";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";
import { Link } from "@/lib/navigation";

export default async function TeacherEditCoursePage({
  params,
}: {
  params: { locale: string; courseId: string };
}) {
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  const { profile } = await requireApprovedRole(params.locale, "teacher");
  const course = await getCourseDetail(params.courseId);

  if (!course || course.teacherId !== profile.id) {
    redirect(localizePath(params.locale, "/teacher/courses"));
  }

  return (
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Teacher workspace"
        title="Edit course details"
        description={`Update ${course.title}, then refine the thumbnail and protected learning materials.`}
        actions={
          <>
            <Button asChild variant="nav" className="border border-border/60 bg-background/82">
              <Link href="/teacher/courses" locale={params.locale}>
                Back to courses
              </Link>
            </Button>
            <form action={deleteCourseAction.bind(null, course.id, params.locale)}>
              <Button type="submit" variant="destructive" className="rounded-full">
                Delete course
              </Button>
            </form>
          </>
        }
      />

      <SectionBlock
        eyebrow="Step 1"
        title="Course details"
        description="Keep the course structure, status, and duration aligned before you publish updates."
        contentClassName="grid gap-6"
      >
        <CourseEditorForm locale={params.locale} course={course} />
      </SectionBlock>

      <SectionBlock
        eyebrow="Step 2"
        title="Course cover"
        description="Upload a thumbnail that carries through the catalog and course details page."
        contentClassName="grid gap-6"
      >
        <CourseThumbnailUploader courseId={course.id} thumbnailUrl={course.thumbnailUrl} />
      </SectionBlock>

      <SectionBlock
        eyebrow="Step 3"
        title="Learning materials"
        description="Add protected documents and videos, then reorder them as the lesson path evolves."
        contentClassName="grid gap-6"
      >
        <CourseMediaManager locale={params.locale} courseId={course.id} media={course.media} />
      </SectionBlock>
    </div>
  );
}
