export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  status: "success" | "failure"
  error?: string
}

export interface AuditQuery {
  userId?: string
  action?: string
  resource?: string
  startDate?: Date
  endDate?: Date
  status?: "success" | "failure"
  limit?: number
}

export class AuditService {
  private logs: AuditLog[] = []

  log(entry: Omit<AuditLog, "id" | "timestamp">): AuditLog {
    const auditLog: AuditLog = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }

    this.logs.unshift(auditLog)

    // Keep only last 10000 logs in memory
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(0, 10000)
    }

    return auditLog
  }

  query(query: AuditQuery = {}): AuditLog[] {
    let results = this.logs

    if (query.userId) {
      results = results.filter((log) => log.userId === query.userId)
    }

    if (query.action) {
      results = results.filter((log) => log.action === query.action)
    }

    if (query.resource) {
      results = results.filter((log) => log.resource === query.resource)
    }

    if (query.status) {
      results = results.filter((log) => log.status === query.status)
    }

    if (query.startDate) {
      results = results.filter((log) => log.timestamp >= query.startDate!)
    }

    if (query.endDate) {
      results = results.filter((log) => log.timestamp <= query.endDate!)
    }

    if (query.limit) {
      results = results.slice(0, query.limit)
    }

    return results
  }

  getRecentLogs(limit = 100): AuditLog[] {
    return this.logs.slice(0, limit)
  }

  getLogsByUser(userId: string, limit = 100): AuditLog[] {
    return this.logs.filter((log) => log.userId === userId).slice(0, limit)
  }

  getLogsByResource(resource: string, resourceId: string, limit = 100): AuditLog[] {
    return this.logs.filter((log) => log.resource === resource && log.resourceId === resourceId).slice(0, limit)
  }
}

export const auditService = new AuditService()
