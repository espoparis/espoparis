import { BookOpenCheck, Eye, Layers3, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/navigation";

type Props = {
  locale: string;
  student: {
    studentId: string;
    studentName: string;
    approvedCourseCount: number;
    activeCourses: Array<{
      courseId: string;
      courseTitle: string;
    }>;
  };
};

export function TeacherStudentRosterCard({ locale, student }: Props) {
  const primaryCourse = student.activeCourses[0];

  return (
    <Card tone={student.approvedCourseCount > 1 ? "strong" : "soft"} className="overflow-hidden">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="rounded-full px-3 py-1">Approved</Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">{student.approvedCourseCount} active course(s)</Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">{student.studentName}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            This learner is currently active across your approved course roster.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="surface-subtle p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserRound className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">Student</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{student.studentName}</p>
          </div>
          <div className="surface-subtle p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers3 className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">Coverage</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {student.approvedCourseCount} approved course(s)
            </p>
          </div>
        </div>

        <div className="surface-subtle p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpenCheck className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-[0.24em]">Active courses</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {student.activeCourses.map((course) => (
              <Badge key={course.courseId} variant="outline" className="rounded-full px-3 py-1">
                {course.courseTitle}
              </Badge>
            ))}
          </div>
        </div>

        {primaryCourse ? (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero">
              <Link href={`/courses/${primaryCourse.courseId}`} locale={locale}>
                <Eye className="h-4 w-4" />
                Open primary course
              </Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
