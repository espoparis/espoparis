import { Card, CardContent } from "@/components/ui/card";
import { TeacherSpotlightCard } from "@/features/marketing/components/teacher-spotlight-card";
import type { PublicTeacherSummary } from "@/lib/types/domain";

type Props = {
  title: string;
  eyebrow: string;
  emptyText: string;
  teachers: PublicTeacherSummary[];
  enabled: boolean;
};

export function HomeTeacherSpotlight({
  title,
  eyebrow,
  emptyText,
  teachers,
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

      {enabled && teachers.length ? (
        <div className="grid gap-4">
          {teachers.slice(0, 2).map((teacher) => (
            <TeacherSpotlightCard key={teacher.id} teacher={teacher} />
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
  );
}
