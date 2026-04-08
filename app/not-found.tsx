import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground antialiased">
      <div className="w-full max-w-xl rounded-[2rem] border border-border/60 bg-card/95 p-8 text-center shadow-sm sm:p-10">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary">404</p>
          <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">Page not found</h1>
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            The page you requested does not exist or may have moved.
          </p>
        </div>
        <div className="mt-6">
          <Button asChild className="rounded-full">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
