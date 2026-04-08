import { z } from "zod";

export const courseSchema = z.object({
  locale: z.string().min(2),
  courseId: z.string().uuid().optional(),
  title: z.string().min(3).max(140),
  description: z.string().min(40),
  type: z.enum(["diploma", "bachelors"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  durationLabel: z.string().min(2).max(80),
  status: z.enum(["draft", "published", "archived"]),
});

export const enrollmentDecisionSchema = z.object({
  locale: z.string().min(2),
  enrollmentId: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
});

export const courseMediaTitleSchema = z.object({
  locale: z.string().min(2),
  mediaId: z.string().uuid(),
  title: z.string().min(2).max(160),
});

export const courseMediaReorderSchema = z.object({
  locale: z.string().min(2),
  mediaId: z.string().uuid(),
  direction: z.enum(["up", "down"]),
});

export const courseCatalogFilterSchema = z.object({
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value ?? ""),
  type: z.enum(["all", "diploma", "bachelors"]).optional().default("all"),
  level: z
    .enum(["all", "beginner", "intermediate", "advanced"])
    .optional()
    .default("all"),
  sort: z
    .enum(["recent", "title-asc", "rating-desc"])
    .optional()
    .default("recent"),
});
