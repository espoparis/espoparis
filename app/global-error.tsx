"use client";

import { RotateCcw } from "lucide-react";
import "@/app/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AppErrorState } from "@/components/ui/app-error-state";
import { bodyFont } from "@/lib/fonts";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html className={bodyFont.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AppShell>
          <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:py-14">
            <AppErrorState
              title="The app hit a critical problem"
              description={
                error.message ||
                "A root-level failure interrupted the experience. Try reloading the app."
              }
              primaryAction={{
                label: "Reload app",
                onClick: reset,
                icon: <RotateCcw className="h-4 w-4" />,
              }}
              footer="If it keeps happening, restart the flow from the homepage."
            />
          </div>
        </AppShell>
      </body>
    </html>
  );
}
