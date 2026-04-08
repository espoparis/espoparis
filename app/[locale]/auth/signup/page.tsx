import { redirect } from "next/navigation";
import { localizePath } from "@/lib/constants/app";

export default function SignupPage({ params }: { params: { locale: string } }) {
  redirect(localizePath(params.locale, "/auth/register"));
}
