import { callDigitalBridge, getDigitalBridgeConfig } from "../integrations/digital-bridge.ts";
import type { ResourceKind } from "../platform/types.ts";

export type EntitlementLookup = {
  userId: string;
  resourceKind: ResourceKind;
  resourceId: string;
};

export interface EntitlementRepository {
  hasActiveEntitlement(lookup: EntitlementLookup): Promise<boolean>;
}

export class AppsScriptEntitlementRepository implements EntitlementRepository {
  async hasActiveEntitlement(lookup: EntitlementLookup): Promise<boolean> {
    if (!getDigitalBridgeConfig()) return false;
    try {
      const result = await callDigitalBridge<EntitlementLookup, { entitled: boolean }>("digital.entitlement.check", lookup);
      return result.entitled === true;
    } catch {
      return false;
    }
  }
}
