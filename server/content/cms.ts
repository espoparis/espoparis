import { validImageReference } from "../media/files.ts";
import type { UserRole } from "@/server/platform/types";

export type ContentKind = "news" | "activity" | "announcement" | "daily-reflection";
export type ContentStatus = "draft" | "review" | "scheduled" | "published" | "archived";
export type ReflectionKind = "quran" | "hadith" | "wisdom";

export type ContentSchedule = {
  publishAt?: string;
  unpublishAt?: string;
  priority?: number;
};

export type DailyReflection = {
  id: string;
  kind: ReflectionKind;
  arabicText: string;
  sourceLabel: string;
  translations?: Partial<Record<"en" | "fr" | "ar" | "fa", string>>;
  occasionLabel?: string;
  activeFrom?: string;
  activeUntil?: string;
  priority: number;
  approved: boolean;
};

export type CmsItem = {
  id: string;
  kind: Exclude<ContentKind, "daily-reflection">;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  coverImage?: string;
  status: ContentStatus;
  schedule?: ContentSchedule;
  authorEmail: string;
  updatedAt: string;
};

export type CmsCapability =
  | "content.view"
  | "content.create"
  | "content.edit"
  | "content.delete"
  | "content.publish"
  | "content.schedule"
  | "reflection.manage"
  | "settings.manage";

const capabilities: Record<UserRole, ReadonlySet<CmsCapability>> = {
  visitor: new Set(),
  member: new Set(),
  student: new Set(),
  teacher: new Set(),
  finance: new Set(),
  "academic-officer": new Set(["content.view"]),
  editor: new Set(["content.view", "content.create", "content.edit", "content.schedule", "reflection.manage"]),
  admin: new Set([
    "content.view", "content.create", "content.edit", "content.delete", "content.publish", "content.schedule", "reflection.manage", "settings.manage",
  ]),
};

export function canCms(role: UserRole, capability: CmsCapability) {
  return capabilities[role]?.has(capability) ?? false;
}

export function validateSchedule(schedule?: ContentSchedule): string[] {
  if (!schedule) return [];
  const errors: string[] = [];
  const start = schedule.publishAt ? Date.parse(schedule.publishAt) : NaN;
  const end = schedule.unpublishAt ? Date.parse(schedule.unpublishAt) : NaN;
  if (schedule.publishAt && Number.isNaN(start)) errors.push("invalid-publish-at");
  if (schedule.unpublishAt && Number.isNaN(end)) errors.push("invalid-unpublish-at");
  if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) errors.push("unpublish-before-publish");
  return errors;
}

export function selectDailyReflection(items: DailyReflection[], at = new Date()): DailyReflection | null {
  const ts = at.getTime();
  const eligible = items.filter((item) => {
    if (!item.approved) return false;
    const from = item.activeFrom ? Date.parse(item.activeFrom) : Number.NEGATIVE_INFINITY;
    const until = item.activeUntil ? Date.parse(item.activeUntil) : Number.POSITIVE_INFINITY;
    return ts >= from && ts <= until;
  });
  if (!eligible.length) return null;
  eligible.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  const maxPriority = eligible[0].priority;
  const pool = eligible.filter((item) => item.priority === maxPriority);
  const dayIndex = Math.floor(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()) / 86400000);
  return pool[Math.abs(dayIndex) % pool.length] ?? null;
}


const allowedTransitions: Record<ContentStatus, ReadonlySet<ContentStatus>> = {
  draft: new Set(["review", "archived"]),
  review: new Set(["draft", "scheduled", "published", "archived"]),
  scheduled: new Set(["draft", "review", "published", "archived"]),
  published: new Set(["archived"]),
  archived: new Set(["draft"]),
};

export function canTransitionContent(role: UserRole, from: ContentStatus, to: ContentStatus) {
  if (!allowedTransitions[from]?.has(to)) return false;
  if (to === "published") return canCms(role, "content.publish");
  if (to === "scheduled") return canCms(role, "content.schedule");
  return canCms(role, "content.edit");
}

export function validateCmsItem(item: CmsItem): string[] {
  const errors: string[] = [];
  if (!["news", "activity", "announcement"].includes(item.kind)) errors.push("invalid-kind");
  if (!["draft", "review", "scheduled", "published", "archived"].includes(item.status)) errors.push("invalid-status");
  if (!validImageReference(item.coverImage)) errors.push("invalid-image");
  if (!item.id.trim()) errors.push("missing-id");
  if (!item.title.trim()) errors.push("missing-title");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) errors.push("invalid-slug");
  if (!item.authorEmail.includes("@")) errors.push("invalid-author-email");
  errors.push(...validateSchedule(item.schedule));
  if (item.status === "scheduled" && !item.schedule?.publishAt) errors.push("scheduled-without-publish-at");
  return Array.from(new Set(errors));
}

export function validateDailyReflection(item: DailyReflection): string[] {
  const errors: string[] = [];
  if (!["quran", "hadith", "wisdom"].includes(item.kind)) errors.push("invalid-kind");
  if (!item.id.trim()) errors.push("missing-id");
  if (!item.arabicText.trim()) errors.push("missing-arabic-text");
  if (!item.sourceLabel.trim()) errors.push("missing-source");
  if (!Number.isFinite(item.priority)) errors.push("invalid-priority");
  const from = item.activeFrom ? Date.parse(item.activeFrom) : NaN;
  const until = item.activeUntil ? Date.parse(item.activeUntil) : NaN;
  if (item.activeFrom && Number.isNaN(from)) errors.push("invalid-active-from");
  if (item.activeUntil && Number.isNaN(until)) errors.push("invalid-active-until");
  if (!Number.isNaN(from) && !Number.isNaN(until) && until < from) errors.push("active-until-before-from");
  return errors;
}
