import { ArrowUpRight, FileText, PencilLine, RadioTower, SquareStack } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CourseCardData } from "@/lib/types/domain";
import { Link } from "@/lib/navigation";

type Props = {
  course: CourseCardData;
  locale: string;
};

function getStatusVariant(status: CourseCardData["status"]) {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "muted";
    default:
      return "outline";
  }
}

export function TeacherCourseCard({ course, locale }: Props) {
  return (
    <Card
      tone={course.status === "published" ? "soft" : course.status === "draft" ? "strong" : "subtle"}
      className="overflow-hidden"
    >
      <div
        className="surface-subtle h-44 w-full border-b border-border/60 bg-cover bg-center"
        style={{
          backgroundImage: course.thumbnailUrl
            ? `url(${course.thumbnailUrl})`
            : undefined,
        }}
      />
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusVariant(course.status)} className="rounded-full px-3 py-1">{course.status}</Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">{course.type}</Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">{course.level}</Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">{course.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {course.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="surface-subtle p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RadioTower className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">Status</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{course.status}</p>
          </div>
          <div className="surface-subtle p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SquareStack className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">Format</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{course.type}</p>
          </div>
          <div className="surface-subtle p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">Duration</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{course.durationLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="hero">
            <Link href={`/teacher/courses/${course.id}/edit`} locale={locale}>
              <PencilLine className="h-4 w-4" />
              Manage course
            </Link>
          </Button>

          {course.status === "published" ? (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href={`/courses/${course.id}`} locale={locale}>
                <ArrowUpRight className="h-4 w-4" />
                Open public page
              </Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
