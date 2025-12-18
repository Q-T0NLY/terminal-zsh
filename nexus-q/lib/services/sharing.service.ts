export interface ShareConfig {
  resourceId: string
  resourceType: "agent" | "workflow" | "dashboard" | "report"
  users: string[]
  permissions: ("view" | "edit" | "admin")[]
  expiresAt?: Date
}

export interface Share {
  id: string
  resourceId: string
  resourceType: string
  sharedBy: string
  sharedWith: string[]
  permissions: string[]
  createdAt: Date
  expiresAt?: Date
  accessCount: number
}

export class SharingService {
  private shares: Map<string, Share> = new Map()

  createShare(config: ShareConfig, userId: string): Share {
    const share: Share = {
      id: `share_${Date.now()}`,
      resourceId: config.resourceId,
      resourceType: config.resourceType,
      sharedBy: userId,
      sharedWith: config.users,
      permissions: config.permissions,
      createdAt: new Date(),
      expiresAt: config.expiresAt,
      accessCount: 0,
    }

    this.shares.set(share.id, share)
    return share
  }

  getShare(shareId: string): Share | undefined {
    return this.shares.get(shareId)
  }

  getSharesByResource(resourceId: string): Share[] {
    return Array.from(this.shares.values()).filter((s) => s.resourceId === resourceId)
  }

  getSharesByUser(userId: string): Share[] {
    return Array.from(this.shares.values()).filter((s) => s.sharedBy === userId || s.sharedWith.includes(userId))
  }

  revokeShare(shareId: string): boolean {
    return this.shares.delete(shareId)
  }

  trackAccess(shareId: string): void {
    const share = this.shares.get(shareId)
    if (share) {
      share.accessCount++
    }
  }
}

export const sharingService = new SharingService()
