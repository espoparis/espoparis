import { createHmac, timingSafeEqual } from "node:crypto";
import type { AuthSession } from "../auth/types.ts";
import { canAccessResource, type AccessDecision } from "../platform/access.ts";
import type { Viewer } from "../platform/types.ts";
import { AppsScriptEntitlementRepository, type EntitlementRepository } from "./entitlement-repository.ts";
import { resolvePublishedDigitalAsset, type DigitalAssetSelector, type InternalDigitalAssetReference } from "./repository.ts";

const MAX_DELIVERY_TTL_SECONDS = 300;

export type DigitalDeliveryClaims = {
  version: 1;
  subject: string;
  selector: DigitalAssetSelector;
  issuedAt: number;
  expiresAt: number;
};

export type DigitalBinary = {
  body: ReadableStream<Uint8Array> | Uint8Array;
  contentType: string;
  contentLength?: number;
  contentRange?: string;
  acceptRanges?: string;
  status?: 200 | 206;
  fileName?: string;
};

export interface DigitalAssetTransport {
  readPrivateFile(fileId: string, options?: { range?: string }): Promise<DigitalBinary>;
}

type DeliveryDependencies = {
  entitlementRepository?: EntitlementRepository;
  resolveAsset?: (selector: DigitalAssetSelector) => Promise<InternalDigitalAssetReference | null>;
  secret?: string;
  now?: Date;
};

type RedemptionDependencies = Pick<DeliveryDependencies, "entitlementRepository" | "resolveAsset" | "secret" | "now">;

function deliverySecret(value = process.env.DIGITAL_DELIVERY_SECRET?.trim() ?? "") {
  if (value.length < 32) throw new Error("Digital delivery is not configured.");
  return value;
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function parseDigitalAssetSelector(value: unknown): DigitalAssetSelector | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<DigitalAssetSelector>;
  if (candidate.resourceKind !== "book" && candidate.resourceKind !== "lesson") return null;
  if (typeof candidate.resourceId !== "string") return null;
  const resourceId = candidate.resourceId.trim();
  if (!resourceId || resourceId.length > 200) return null;
  if (candidate.resourceKind === "book") {
    if (candidate.assetKind !== "pdf" && candidate.assetKind !== "cover") return null;
    return { resourceKind: "book", resourceId, assetKind: candidate.assetKind };
  }
  if (candidate.assetKind === "video" || candidate.assetKind === "audio") {
    return { resourceKind: "lesson", resourceId, assetKind: candidate.assetKind };
  }
  if (candidate.assetKind !== "attachment" || !Number.isInteger(candidate.attachmentIndex)) return null;
  const attachmentIndex = candidate.attachmentIndex as number;
  if (attachmentIndex < 0 || attachmentIndex > 1000) return null;
  return { resourceKind: "lesson", resourceId, assetKind: "attachment", attachmentIndex };
}

async function accessDecisionForAsset(
  session: AuthSession,
  asset: InternalDigitalAssetReference,
  entitlementRepository?: EntitlementRepository,
): Promise<AccessDecision> {
  const identity = session.authenticated ? session.identity : null;
  let entitled = false;
  if (asset.accessLevel === "paid" && identity) {
    const repository = entitlementRepository ?? new AppsScriptEntitlementRepository();
    entitled = await repository.hasActiveEntitlement({
      userId: identity.id,
      resourceKind: asset.selector.resourceKind,
      resourceId: asset.selector.resourceId,
    });
  }
  const viewer: Viewer = identity
    ? { userId: identity.id, role: identity.role, authenticated: true, entitlementResourceIds: entitled ? [asset.selector.resourceId] : [] }
    : { role: "visitor", authenticated: false };
  return canAccessResource(viewer, asset.accessLevel, asset.selector.resourceId);
}

export function issueDigitalDeliveryToken(claims: DigitalDeliveryClaims, secretInput?: string) {
  const secret = deliverySecret(secretInput);
  if (!parseDigitalAssetSelector(claims.selector)) throw new Error("Invalid digital asset request.");
  if (claims.expiresAt <= claims.issuedAt || claims.expiresAt - claims.issuedAt > MAX_DELIVERY_TTL_SECONDS) {
    throw new Error("Invalid digital delivery expiry.");
  }
  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function verifyDigitalDeliveryToken(token: string, expectedSubject: string, secretInput?: string, now = new Date()): DigitalDeliveryClaims | null {
  const secret = deliverySecret(secretInput);
  const [payload, supplied, extra] = token.split(".");
  if (!payload || !supplied || extra) return null;
  const expected = signature(payload, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DigitalDeliveryClaims;
    const nowSeconds = Math.floor(now.getTime() / 1000);
    const selector = parseDigitalAssetSelector(claims.selector);
    if (claims.version !== 1 || claims.subject !== expectedSubject || !selector) return null;
    if (!Number.isInteger(claims.issuedAt) || !Number.isInteger(claims.expiresAt)) return null;
    if (claims.issuedAt > nowSeconds + 30 || claims.expiresAt <= nowSeconds || claims.expiresAt - claims.issuedAt > MAX_DELIVERY_TTL_SECONDS) return null;
    return { ...claims, selector };
  } catch {
    return null;
  }
}

export async function authorizeDigitalAssetDelivery(
  session: AuthSession,
  selector: DigitalAssetSelector,
  dependencies: DeliveryDependencies = {},
): Promise<{ token: string; expiresAt: string; decision: AccessDecision }> {
  const parsedSelector = parseDigitalAssetSelector(selector);
  if (!parsedSelector) throw new Error("Invalid digital asset request.");
  const resolveAsset = dependencies.resolveAsset ?? resolvePublishedDigitalAsset;
  const asset = await resolveAsset(parsedSelector);
  if (!asset) throw new Error("Digital asset not found.");

  const identity = session.authenticated ? session.identity : null;
  const decision = await accessDecisionForAsset(session, asset, dependencies.entitlementRepository);
  if (!decision.allowed) throw new Error(decision.reason);

  const now = dependencies.now ?? new Date();
  const issuedAt = Math.floor(now.getTime() / 1000);
  const expiresAt = issuedAt + MAX_DELIVERY_TTL_SECONDS;
  const subject = identity?.id ?? "public";
  const token = issueDigitalDeliveryToken({ version: 1, subject, selector: parsedSelector, issuedAt, expiresAt }, dependencies.secret);
  return { token, expiresAt: new Date(expiresAt * 1000).toISOString(), decision };
}

export async function redeemDigitalAssetDelivery(
  token: string,
  session: AuthSession,
  transport: DigitalAssetTransport,
  dependencies: RedemptionDependencies = {},
): Promise<DigitalBinary> {
  const subject = session.identity?.id ?? "public";
  const claims = verifyDigitalDeliveryToken(token, subject, dependencies.secret, dependencies.now);
  if (!claims) throw new Error("Invalid or expired digital delivery token.");
  const asset = await (dependencies.resolveAsset ?? resolvePublishedDigitalAsset)(claims.selector);
  if (!asset) throw new Error("Digital asset not found.");
  const decision = await accessDecisionForAsset(session, asset, dependencies.entitlementRepository);
  if (!decision.allowed) throw new Error(decision.reason);
  return transport.readPrivateFile(asset.fileId);
}
