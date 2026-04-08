import { getTranslations } from "next-intl/server";
import { BookOpen, Clock3, GraduationCap, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CourseDetailData } from "@/lib/types/domain";

type Props = {
  locale: string;
  course: CourseDetailData;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function CourseDetailHero({ locale, course }: Props) {
  const t = await getTranslations({ locale, namespace: "courseDetail.hero" });

  return (
    <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="content-cluster">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{t(`types.${course.type}`)}</Badge>
          <Badge variant="outline">{t(`levels.${course.level}`)}</Badge>
          <Badge variant={course.status === "published" ? "default" : "outline"}>
            {t(`statuses.${course.status}`)}
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            {course.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {course.description}
          </p>
        </div>

        <div className="metric-strip">
          <Card tone="subtle" className="h-full">
            <CardContent className="space-y-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("teacherLabel")}</p>
                <p className="mt-2 font-medium">{course.teacherName}</p>
              </div>
            </CardContent>
          </Card>

          <Card tone="subtle" className="h-full">
            <CardContent className="space-y-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("durationLabel")}</p>
                <p className="mt-2 font-medium">{course.durationLabel}</p>
              </div>
            </CardContent>
          </Card>

          <Card tone="subtle" className="h-full">
            <CardContent className="space-y-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("ratingLabel")}</p>
                <p className="mt-2 font-medium">
                  {course.averageRating ? course.averageRating.toFixed(1) : t("newLabel")} ·{" "}
                  {course.reviewCount} {t("reviewsSuffix")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card tone="soft">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <Avatar className="h-14 w-14 border border-border/60 bg-background">
              <AvatarImage
                src={course.teacherAvatarUrl ?? undefined}
                alt={course.teacherName}
              />
              <AvatarFallback>{getInitials(course.teacherName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("instructorLabel")}</p>
              <p className="text-lg font-semibold text-foreground">{course.teacherName}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {t("instructorDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 shadow-sm">
        <div
          className="surface-subtle min-h-[340px] bg-cover bg-center sm:min-h-[420px]"
          style={{
            backgroundImage: course.thumbnailUrl
              ? `url(${course.thumbnailUrl})`
              : undefined,
          }}
        />
        <div className="surface-subtle space-y-4 p-6">
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.3em]">{t("expectLabel")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              t("expectations.first"),
              t("expectations.second"),
              t("expectations.third"),
              t("expectations.fourth"),
            ].map((item) => (
              <div
                key={item}
                className="inset-panel px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
