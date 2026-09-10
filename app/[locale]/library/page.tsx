import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LibraryShell } from "@/features/library/components/library-shell";
import { buildPageMetadata } from "@/lib/seo";
import { digitalLibraryRepository } from "@/server/digital/repository";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "library" });
  return buildPageMetadata({
    locale: params.locale,
    path: "/library",
    title: t("title"),
    description: t("description"),
  });
}

export default async function LibraryPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "library" });
  const books = await digitalLibraryRepository.listPublishedBooks();

  return <LibraryShell copy={t.raw("copy")} books={books} />;
}
