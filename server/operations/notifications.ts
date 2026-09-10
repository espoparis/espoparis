export type NotificationKind =
  | "grade-submitted"
  | "grade-returned"
  | "grade-published"
  | "attendance-alert"
  | "promotion-ready"
  | "promotion-approved"
  | "enrollment-matched"
  | "payment-confirmed"
  | "recording-published"
  | "system";

export type NotificationChannel = "in-app" | "email";
export type NotificationAudienceRole = "student" | "teacher" | "editor" | "admin";

export type AcademicNotification = {
  id: string;
  recipientUserId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  channels: NotificationChannel[];
  createdAt: string;
  readAt?: string | null;
  actionHref?: string;
  entityType?: "enrollment" | "course" | "grade" | "attendance" | "payment" | "recording";
  entityId?: string;
};

export type NotificationPreference = {
  userId: string;
  inApp: boolean;
  email: boolean;
};

export function markNotificationRead(notification: AcademicNotification, readAt: string): AcademicNotification {
  if (notification.readAt) return notification;
  return { ...notification, readAt };
}

export function countUnread(notifications: AcademicNotification[]): number {
  return notifications.filter((notification) => !notification.readAt).length;
}

export function selectDeliveryChannels(
  requested: NotificationChannel[],
  preference: NotificationPreference,
): NotificationChannel[] {
  return requested.filter((channel) => {
    if (channel === "in-app") return preference.inApp;
    if (channel === "email") return preference.email;
    return false;
  });
}

export function defaultNotificationPreference(userId: string): NotificationPreference {
  return { userId, inApp: true, email: true };
}
