import { z } from "zod";

export const adminUserFilterSchema = z.object({
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value ?? ""),
  role: z.enum(["all", "admin", "teacher", "student"]).optional().default("all"),
  status: z
    .enum(["all", "pending", "approved", "rejected"])
    .optional()
    .default("all"),
  sort: z.enum(["recent", "name-asc", "name-desc"]).optional().default("recent"),
});

export const teacherRosterFilterSchema = z.object({
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value ?? ""),
  scope: z.enum(["all", "single", "multi"]).optional().default("all"),
  sort: z
    .enum(["coverage-desc", "student-asc", "student-desc"])
    .optional()
    .default("coverage-desc"),
});

export const teacherCourseFilterSchema = z.object({
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value ?? ""),
  status: z.enum(["all", "draft", "published", "archived"]).optional().default("all"),
  type: z.enum(["all", "diploma", "bachelors"]).optional().default("all"),
  sort: z.enum(["recent", "title-asc", "title-desc"]).optional().default("recent"),
});

export const adminCourseFilterSchema = z.object({
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value ?? ""),
  lane: z.enum(["all", "watchlist", "live", "archive"]).optional().default("all"),
  status: z.enum(["all", "draft", "published", "archived"]).optional().default("all"),
  sort: z.enum(["recent", "title-asc", "rating-desc"]).optional().default("recent"),
});

export const studentEnrollmentFilterSchema = z.object({
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value ?? ""),
  status: z.enum(["all", "pending", "approved", "rejected"]).optional().default("all"),
  sort: z
    .enum(["recent", "title-asc", "teacher-asc"])
    .optional()
    .default("recent"),
});

export const teacherEnrollmentFilterSchema = z.object({
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value ?? ""),
  status: z.enum(["all", "pending", "approved", "rejected"]).optional().default("all"),
  lane: z.enum(["all", "queue", "reviewed"]).optional().default("all"),
  sort: z
    .enum(["recent", "student-asc", "course-asc"])
    .optional()
    .default("recent"),
});
