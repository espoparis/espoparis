import { z } from "zod";

export const profileSchema = z.object({
  locale: z.string().min(2),
  fullName: z.string().min(2).max(120),
  bio: z.string().max(600).default(""),
});
