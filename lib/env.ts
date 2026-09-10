import { z } from "zod";

const serverEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  RESEND_REPLY_TO_EMAIL: z.string().email().optional(),
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1).optional(),
  AUTH_SESSION_SECRET: z.string().min(32).optional(),
  AUTH_BASE_URL: z.string().url().optional(),
  ENROLLMENT_API_URL: z.string().url().optional(),
  ENROLLMENT_API_SECRET: z.string().min(32).optional(),
  ACADEMIC_API_URL: z.string().url().optional(),
  ACADEMIC_API_SECRET: z.string().min(32).optional(),
  CMS_API_URL: z.string().url().optional(),
  CMS_API_SECRET: z.string().min(32).optional(),
  DIGITAL_API_URL: z.string().url().optional(),
  DIGITAL_API_SECRET: z.string().min(32).optional(),
  DIGITAL_DELIVERY_SECRET: z.string().min(32).optional(),
  DIGITAL_DRIVE_CLIENT_ID: z.string().min(1).optional(),
  DIGITAL_DRIVE_CLIENT_SECRET: z.string().min(1).optional(),
  DIGITAL_DRIVE_REFRESH_TOKEN: z.string().min(1).optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv | null {
  const parsed = serverEnvSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_REPLY_TO_EMAIL: process.env.RESEND_REPLY_TO_EMAIL,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    AUTH_BASE_URL: process.env.AUTH_BASE_URL,
    ENROLLMENT_API_URL: process.env.ENROLLMENT_API_URL,
    ENROLLMENT_API_SECRET: process.env.ENROLLMENT_API_SECRET,
    ACADEMIC_API_URL: process.env.ACADEMIC_API_URL,
    ACADEMIC_API_SECRET: process.env.ACADEMIC_API_SECRET,
    CMS_API_URL: process.env.CMS_API_URL,
    CMS_API_SECRET: process.env.CMS_API_SECRET,
    DIGITAL_API_URL: process.env.DIGITAL_API_URL,
    DIGITAL_API_SECRET: process.env.DIGITAL_API_SECRET,
    DIGITAL_DELIVERY_SECRET: process.env.DIGITAL_DELIVERY_SECRET,
    DIGITAL_DRIVE_CLIENT_ID: process.env.DIGITAL_DRIVE_CLIENT_ID,
    DIGITAL_DRIVE_CLIENT_SECRET: process.env.DIGITAL_DRIVE_CLIENT_SECRET,
    DIGITAL_DRIVE_REFRESH_TOKEN: process.env.DIGITAL_DRIVE_REFRESH_TOKEN,
  });

  return parsed.success ? parsed.data : null;
}

export function requireServerEnv(): ServerEnv {
  const env = getServerEnv();

  if (!env) {
    throw new Error("Missing required server environment variables.");
  }

  return env;
}

export function getOptionalEmailEnv() {
  const env = getServerEnv();

  if (!env?.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return null;
  }

  return {
    apiKey: env.RESEND_API_KEY,
    fromEmail: env.RESEND_FROM_EMAIL,
    replyToEmail: env.RESEND_REPLY_TO_EMAIL,
  };
}

export function isEmailConfigured() {
  return Boolean(getOptionalEmailEnv());
}
