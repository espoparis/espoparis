import { Card, CardContent } from "@/components/ui/card";
import { CourseCard } from "@/features/courses/components/course-card";
import type { CourseCardData } from "@/lib/types/domain";

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  emptyText: string;
  courses: CourseCardData[];
  enabled: boolean;
};

export function HomeFeaturedCourses({
  locale,
  eyebrow,
  title,
  emptyText,
  courses,
  enabled,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="content-measure space-y-2">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      <div className="space-y-6">
        {enabled && courses.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {courses.slice(0, 2).map((course) => (
              <CourseCard key={course.id} course={course} locale={locale} />
            ))}
          </div>
        ) : enabled ? (
          <Card tone="strong" className="display-shadow">
            <CardContent className="p-6 text-sm text-muted-foreground">
              {emptyText}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
