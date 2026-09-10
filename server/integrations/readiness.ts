export type IntegrationReadiness = {
  enrollmentBridge: boolean;
  academicBridge: boolean;
  digitalBridge: boolean;
  digitalDelivery: boolean;
  googleOAuth: boolean;
  magicLink: boolean;
};

type EnvLike = Record<string, string | undefined>;

export function getIntegrationReadiness(env: EnvLike = process.env): IntegrationReadiness {
  return {
    enrollmentBridge: Boolean(env.ENROLLMENT_API_URL && env.ENROLLMENT_API_SECRET && env.ENROLLMENT_API_SECRET.length >= 32),
    academicBridge: Boolean(env.ACADEMIC_API_URL && env.ACADEMIC_API_SECRET && env.ACADEMIC_API_SECRET.length >= 32),
    digitalBridge: Boolean(env.DIGITAL_API_URL?.startsWith("https://") && env.DIGITAL_API_SECRET && env.DIGITAL_API_SECRET.length >= 32),
    digitalDelivery: Boolean(
      env.DIGITAL_API_URL?.startsWith("https://")
      && env.DIGITAL_API_SECRET && env.DIGITAL_API_SECRET.length >= 32
      && env.DIGITAL_DELIVERY_SECRET && env.DIGITAL_DELIVERY_SECRET.length >= 32
      && env.DIGITAL_DRIVE_CLIENT_ID
      && env.DIGITAL_DRIVE_CLIENT_SECRET
      && env.DIGITAL_DRIVE_REFRESH_TOKEN
    ),
    googleOAuth: Boolean(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET && env.AUTH_SESSION_SECRET && env.AUTH_SESSION_SECRET.length >= 32),
    magicLink: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL && env.AUTH_SESSION_SECRET && env.AUTH_SESSION_SECRET.length >= 32),
  };
}
