import Link from "next/link";
import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { bodyFont } from "@/lib/fonts";
import { routing } from "@/i18n/routing";

/**
 * Root-level 404. This renders outside `[locale]`, so it owns its own document
 * and falls back to the default locale for language metadata.
 */
export default function NotFound() {
  return (
    <html lang={routing.defaultLocale} dir="ltr" className={bodyFont.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
          <div className="w-full max-w-xl rounded-[2rem] border border-border/60 bg-card/95 p-8 text-center shadow-sm sm:p-10">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary">
                404
              </p>
              <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                Page not found
              </h1>
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
      </body>
    </html>
  );
}
