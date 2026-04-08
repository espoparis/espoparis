import { useTranslations } from "next-intl";
import { ArrowUpRight, Clock3, Star, UserRound } from "lucide-react";
import type { CourseCardData } from "@/lib/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

type Props = {
  course: CourseCardData;
  locale: string;
};

export function CourseCard({ course, locale }: Props) {
  const t = useTranslations("catalog.card");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-border/60 bg-background/74 shadow-[0_24px_64px_-44px_hsl(var(--foreground)/0.18)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-42px_hsl(var(--foreground)/0.24)]">
      <div
        className="surface-subtle h-56 w-full rounded-none border-x-0 border-t-0 bg-cover bg-center"
        style={
          course.thumbnailUrl
            ? { backgroundImage: `url(${course.thumbnailUrl})` }
            : undefined
        }
      >
        {!course.thumbnailUrl ? (
          <div className="flex h-full w-full items-end justify-between bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_42%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--secondary)/0.52))] p-5">
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {t(`type.${course.type}`)}
            </Badge>
            <div className="rounded-full border border-border/60 bg-background/75 p-2 text-foreground/80 backdrop-blur-md">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        ) : null}
      </div>
      <div className="content-cluster flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {t(`type.${course.type}`)}
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            {t(`level.${course.level}`)}
          </Badge>
          <Badge
            variant={course.status === "published" ? "default" : "outline"}
            className="rounded-full px-3 py-1"
          >
            {t(`status.${course.status}`)}
          </Badge>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">
            {course.title}
          </h3>
          <p className="line-clamp-3 text-base leading-7 text-muted-foreground">
            {course.description}
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-[1.35rem] border border-border/60 bg-border/60 sm:grid-cols-2">
          <div className="flex items-center gap-3 bg-background/82 px-4 py-3 text-sm text-muted-foreground">
            <UserRound className="h-4 w-4 text-primary" />
            <span>{course.teacherName}</span>
          </div>
          <div className="flex items-center gap-3 bg-background/82 px-4 py-3 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>{course.durationLabel}</span>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/60 pt-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-current text-accent" />
            <span>
              {course.averageRating ? course.averageRating.toFixed(1) : t("new")} ·{" "}
              {course.reviewCount} {t("reviews")}
            </span>
          </div>
          <Button asChild variant="soft" size="lg">
            <Link href={`/courses/${course.id}`} locale={locale}>
              {t("viewCourse")}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
