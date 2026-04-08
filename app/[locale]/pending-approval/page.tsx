import { redirect } from "next/navigation";
import { localizePath } from "@/lib/constants/app";

export default function PendingApprovalPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(localizePath(params.locale, "/pending"));
}
