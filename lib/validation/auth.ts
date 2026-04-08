import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  locale: z.string().min(2),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    role: z.enum(["teacher", "student"]),
    primaryInterest: z.string().min(2).optional(),
    previousCourses: z.string().optional(),
    hasTakenCourses: z.enum(["yes", "no"]).optional(),
    locale: z.string().min(2),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }

    if (data.role === "student" && !data.primaryInterest) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Primary interest is required for student applications.",
        path: ["primaryInterest"],
      });
    }
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
  locale: z.string().min(2),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    locale: z.string().min(2),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });
