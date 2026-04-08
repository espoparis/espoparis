import { Card, CardContent } from "@/components/ui/card";

type SummaryItem = {
  label: string;
  value: string | number;
  description: string;
  tone?: "soft" | "accent" | "subtle" | "strong";
};

type Props = {
  items: SummaryItem[];
  narrative?: string;
};

export function AdminSummaryStrip({ items, narrative }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} tone={item.tone ?? "soft"}>
          <CardContent className="space-y-3 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {item.label}
            </p>
            <p className="font-display text-4xl font-semibold tracking-tight text-foreground">
              {item.value}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}

      {narrative ? (
        <Card tone="strong" className="md:col-span-2 xl:col-span-3">
          <CardContent className="p-5">
            <p className="section-eyebrow">Platform overview</p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {narrative}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
