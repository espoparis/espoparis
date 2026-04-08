import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export const middleware = createIntlMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
