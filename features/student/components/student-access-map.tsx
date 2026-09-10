import { BookOpenCheck, CreditCard, Radio, Video } from "lucide-react";

export type StudentAccessMapCopy = {
  title: string;
  description: string;
  officialTitle: string;
  officialDescription: string;
  buyerTitle: string;
  buyerDescription: string;
  classroomLabel: string;
  recordingsLabel: string;
  includedLabel: string;
  purchasedLabel: string;
};

export function StudentAccessMap({ copy }: { copy: StudentAccessMapCopy }) {
  return (
    <section className="mx-auto mt-12 max-w-5xl">
      <div className="max-w-3xl">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{copy.description}</p>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-7">
          <div className="flex items-center gap-3"><BookOpenCheck className="size-5 text-primary"/><h3 className="font-display text-2xl font-semibold">{copy.officialTitle}</h3></div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.officialDescription}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary/45 p-4"><Radio className="size-4 text-primary"/><p className="mt-2 text-sm font-semibold">{copy.classroomLabel}</p></div>
            <div className="rounded-2xl bg-secondary/45 p-4"><Video className="size-4 text-primary"/><p className="mt-2 text-sm font-semibold">{copy.recordingsLabel}</p></div>
          </div>
          <p className="mt-4 rounded-full bg-primary/10 px-4 py-2 text-center text-xs font-semibold text-primary">{copy.includedLabel}</p>
        </article>
        <article className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-7">
          <div className="flex items-center gap-3"><CreditCard className="size-5 text-primary"/><h3 className="font-display text-2xl font-semibold">{copy.buyerTitle}</h3></div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.buyerDescription}</p>
          <p className="mt-5 rounded-full bg-secondary px-4 py-2 text-center text-xs font-semibold text-foreground">{copy.purchasedLabel}</p>
        </article>
      </div>
    </section>
  );
}
