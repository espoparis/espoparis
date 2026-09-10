import type { AuthIdentity } from "../auth/types.ts";
import { callDigitalBridge, getDigitalBridgeConfig } from "../integrations/digital-bridge.ts";
import { publishedBooks, publishedLessons, type LibraryCatalogRecord, type LearningCatalogRecord } from "./catalog.ts";
import type { LibraryRepository, LearningRepository } from "../platform/repositories.ts";
import type { AccessLevel, AssetKind, ResourceKind } from "../platform/types.ts";

export type DigitalRepositoryState = "connected" | "not-configured" | "error";
export type DigitalSnapshot = { state: DigitalRepositoryState; books: LibraryCatalogRecord[]; lessons: LearningCatalogRecord[]; error?: string };
export function isDigitalPlatformConfigured() { return Boolean(getDigitalBridgeConfig()); }

export async function getDigitalAdminSnapshot(identity: AuthIdentity): Promise<DigitalSnapshot> {
  if (!getDigitalBridgeConfig()) return { state: "not-configured", books: [], lessons: [] };
  try {
    const result = await callDigitalBridge<Record<string, never>, { books: LibraryCatalogRecord[]; lessons: LearningCatalogRecord[] }>("digital.admin.snapshot", {}, identity);
    return { state: "connected", books: result.books ?? [], lessons: result.lessons ?? [] };
  } catch (error) {
    return { state: "error", books: [], lessons: [], error: error instanceof Error ? error.message : "Unknown digital platform error." };
  }
}

async function getPublicSnapshot(): Promise<DigitalSnapshot> {
  if (!getDigitalBridgeConfig()) return { state: "not-configured", books: [], lessons: [] };
  try {
    const result = await callDigitalBridge<Record<string, never>, { books: LibraryCatalogRecord[]; lessons: LearningCatalogRecord[] }>("digital.public.snapshot", {});
    return { state: "connected", books: result.books ?? [], lessons: result.lessons ?? [] };
  } catch (error) {
    return { state: "error", books: [], lessons: [], error: error instanceof Error ? error.message : "Unknown digital platform error." };
  }
}

export const digitalLibraryRepository: LibraryRepository = {
  async listPublishedBooks() { return publishedBooks((await getPublicSnapshot()).books); },
  async findPublishedBookBySlug(slug) { return (await this.listPublishedBooks()).find((book) => book.slug === slug) ?? null; },
};

export const digitalLearningRepository: LearningRepository = {
  async listPublishedLessons(courseId) { return publishedLessons((await getPublicSnapshot()).lessons, courseId); },
  async findPublishedLesson(id) { return publishedLessons((await getPublicSnapshot()).lessons).find((lesson) => lesson.id === id) ?? null; },
};

export async function saveLibraryRecord(identity: AuthIdentity, record: LibraryCatalogRecord) { return callDigitalBridge("digital.library.save", { record }, identity); }
export async function saveLearningRecord(identity: AuthIdentity, record: LearningCatalogRecord) { return callDigitalBridge("digital.learning.save", { record }, identity); }
export async function transitionLibraryRecord(identity: AuthIdentity, id: string, status: LibraryCatalogRecord["status"]) { return callDigitalBridge("digital.library.transition", { id, status }, identity); }
export async function transitionLearningRecord(identity: AuthIdentity, id: string, status: LearningCatalogRecord["status"]) { return callDigitalBridge("digital.learning.transition", { id, status }, identity); }

export type DigitalAssetSelector = {
  resourceKind: Extract<ResourceKind, "book" | "lesson">;
  resourceId: string;
  assetKind: AssetKind;
  attachmentIndex?: number;
};

export type InternalDigitalAssetReference = {
  selector: DigitalAssetSelector;
  accessLevel: AccessLevel;
  fileId: string;
};

/** Server-only lookup. Raw Drive IDs never cross the public repository contract. */
export async function resolvePublishedDigitalAsset(selector: DigitalAssetSelector): Promise<InternalDigitalAssetReference | null> {
  if (!getDigitalBridgeConfig()) return null;
  try {
    const result = await callDigitalBridge<DigitalAssetSelector, { accessLevel: AccessLevel; fileId: string } | null>("digital.asset.resolve", selector);
    return result?.fileId ? { selector, accessLevel: result.accessLevel, fileId: result.fileId } : null;
  } catch {
    return null;
  }
}
