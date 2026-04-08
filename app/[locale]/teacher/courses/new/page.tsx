import { CourseEditorForm } from "@/features/courses/components/course-editor-form";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { SectionBlock } from "@/components/layout/section-block";

export default function TeacherNewCoursePage({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow="Teacher workspace"
        title="Create a course"
        description="Start with the course structure, then return here to add media and refine the details."
        actions={
          <Button asChild variant="nav" className="border border-border/60 bg-background/82">
            <Link href="/teacher/courses" locale={params.locale}>
              Back to courses
            </Link>
          </Button>
        }
      />

      <SectionBlock
        eyebrow="Step 1"
        title="Course details"
        description="Define the core course information before you add visuals or lesson assets."
        contentClassName="grid gap-6"
      >
        <CourseEditorForm locale={params.locale} />
      </SectionBlock>
    </div>
  );
}
