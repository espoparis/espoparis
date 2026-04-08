import { z } from "zod";

const serverEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  RESEND_REPLY_TO_EMAIL: z.string().email().optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv | null {
  const parsed = serverEnvSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_REPLY_TO_EMAIL: process.env.RESEND_REPLY_TO_EMAIL,
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
