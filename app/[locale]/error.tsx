"use client";

import { Home, RotateCcw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageFrame } from "@/components/layout/page-frame";
import { AppErrorState } from "@/components/ui/app-error-state";
import { useRouter } from "@/lib/navigation";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const tError = useTranslations("status.error");
  const tCommon = useTranslations("common.actions");
  const router = useRouter();

  return (
    <PageFrame className="flex min-h-[70vh] items-center py-12 sm:py-14">
      <div className="mx-auto w-full max-w-xl">
        {/* `error.message` is deliberately not surfaced: in production it can
            carry internal detail that visitors should not see. */}
        <AppErrorState
          title={tError("pageTitle")}
          description={tError("pageDescription")}
          primaryAction={{
            label: tCommon("tryAgain"),
            onClick: reset,
            icon: <RotateCcw className="h-4 w-4" />,
          }}
          secondaryAction={{
            label: tCommon("returnHome"),
            onClick: () => router.push("/", { locale }),
            variant: "outline",
            icon: <Home className="h-4 w-4" />,
          }}
          footer={tError("pageFooter")}
        />
      </div>
    </PageFrame>
  );
}
