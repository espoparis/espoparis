import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { PublicTeacherSummary } from "@/lib/types/domain";

type Props = {
  teacher: PublicTeacherSummary;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeacherSpotlightCard({ teacher }: Props) {
  const t = useTranslations("home.teacherCard");

  return (
    <Card tone="strong" className="display-shadow overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{teacher.fullName}</CardTitle>
            <CardDescription className="leading-6">
              {teacher.publishedCourseCount} {t("publishedCourses")}
            </CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            Teacher
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-6 pt-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border border-border/60 bg-background">
            <AvatarImage src={teacher.avatarUrl ?? undefined} alt={teacher.fullName} />
            <AvatarFallback>{getInitials(teacher.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm leading-6 text-muted-foreground">
              {teacher.bio || t("fallbackBio")}
            </p>
          </div>
        </div>

        <div className="inset-panel flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 text-primary" />
          {t("approvedProfile")}
        </div>
      </CardContent>
    </Card>
  );
}
