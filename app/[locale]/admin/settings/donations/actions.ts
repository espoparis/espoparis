"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/server/auth/session";
import { saveDonationSettings } from "@/server/content/cms-repository";

export async function saveDonationSettingsAction(data: FormData) {
  const session = await getAuthSession();
  if (session.identity?.role !== "admin") throw new Error("Administrator required.");
  await saveDonationSettings(session.identity, {
    enabled: data.get("enabled") === "on",
    paypalUrl: String(data.get("paypalUrl") ?? "").trim(),
  });
  revalidatePath("/", "layout");
}
