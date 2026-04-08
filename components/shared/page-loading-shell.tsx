import { BrandLoader } from "@/components/ui/loader";

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  cards?: number;
};

export function PageLoadingShell({
  eyebrow = "Loading section",
  title = "Preparing your latest view",
  description = "We are loading the most relevant data and arranging the page surface.",
}: Props) {
  return (
    <div className="flex min-h-[72vh] items-center justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-16">
      <BrandLoader label={`${eyebrow}. ${title}. ${description}`} />
    </div>
  );
}
