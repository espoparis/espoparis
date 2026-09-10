import type { StoredAsset } from "./types";

export type AssetAccessContext = {
  userId?: string;
  expiresInSeconds?: number;
};

export interface AssetStorage {
  getAsset(assetId: string): Promise<StoredAsset | null>;
  getReadUrl(asset: StoredAsset, context?: AssetAccessContext): Promise<string>;
  getDownloadUrl(asset: StoredAsset, context?: AssetAccessContext): Promise<string | null>;
}

/**
 * Runtime adapter contract only.
 * The production Google Drive adapter will be added after a Google Cloud
 * service identity / OAuth strategy is approved and credentials are configured.
 */
export interface GoogleDriveGateway {
  createViewerLink(fileId: string, expiresInSeconds?: number): Promise<string>;
  createDownloadLink(fileId: string, expiresInSeconds?: number): Promise<string>;
  grantViewer(fileId: string, email: string): Promise<void>;
  revokeViewer(fileId: string, email: string): Promise<void>;
}
