/**
 * 🛡️ Security Registry - SBOM, Vulnerabilities, Policies
 */

import {
  SubRegistryType,
  SecurityRegistryEntry,
  SubRegistryConfig,
  SubRegistryQuery,
  SubRegistryResult,
} from '../models/sub-registry';
import { ISubRegistry } from './orchestrator';

export class SecurityRegistry implements ISubRegistry<SecurityRegistryEntry> {
  readonly type = SubRegistryType.SECURITY;
  readonly config: SubRegistryConfig;
  
  private entries: Map<string, SecurityRegistryEntry> = new Map();
  
  constructor(config?: Partial<SubRegistryConfig>) {
    this.config = {
      type: SubRegistryType.SECURITY,
      enabled: true,
      indexing: {
        enabled: true,
        fields: ['securityType', 'severity', 'sbom', 'vulnerability', 'policy'],
      },
      validation: {
        strict: true,
      },
      storage: {
        backend: 'sqlite',
        path: './security-registry.db',
      },
      ...config,
    };
  }

  async initialize(): Promise<void> {
    console.log('🛡️  Initializing Security Registry');
  }

  async register(entry: SecurityRegistryEntry): Promise<string> {
    const id = `security-${entry.namespace}:${entry.name}`;
    
    // Alert on critical vulnerabilities
    if (entry.metadata.vulnerability && entry.metadata.severity === 'critical') {
      console.warn(`🚨 CRITICAL VULNERABILITY: ${entry.metadata.vulnerability.cve}`);
    }
    
    this.entries.set(id, entry);
    return id;
  }

  async query(query: SubRegistryQuery): Promise<SubRegistryResult<SecurityRegistryEntry>> {
    let results = Array.from(this.entries.values());
    
    if (query.namespace) {
      results = results.filter(e => e.namespace === query.namespace);
    }
    
    // Filter by severity if provided in annotations
    if (query.annotations?.severity) {
      results = results.filter(e => e.metadata.severity === query.annotations!.severity);
    }
    
    const total = results.length;
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    
    return {
      entries: results.slice(offset, offset + limit),
      total,
      offset,
      limit,
      hasMore: offset + limit < total,
    };
  }

  async get(id: string): Promise<SecurityRegistryEntry | null> {
    return this.entries.get(id) || null;
  }

  async update(id: string, entry: Partial<SecurityRegistryEntry>): Promise<boolean> {
    const existing = this.entries.get(id);
    if (!existing) return false;
    
    this.entries.set(id, { ...existing, ...entry } as SecurityRegistryEntry);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return this.entries.delete(id);
  }

  async validate(entry: SecurityRegistryEntry): Promise<boolean> {
    // Validate security entry has required data
    if (entry.metadata.securityType === 'vulnerability' && !entry.metadata.vulnerability) {
      return false;
    }
    if (entry.metadata.securityType === 'sbom' && !entry.metadata.sbom) {
      return false;
    }
    
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return this.entries.size >= 0;
  }

  /**
   * Get vulnerability summary
   */
  async getVulnerabilitySummary(): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    unpatched: number;
  }> {
    const vulnEntries = Array.from(this.entries.values()).filter(
      e => e.metadata.securityType === 'vulnerability'
    );
    
    const bySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };
    
    let unpatched = 0;
    
    vulnEntries.forEach(entry => {
      if (entry.metadata.severity) {
        bySeverity[entry.metadata.severity]++;
      }
      if (entry.metadata.vulnerability && !entry.metadata.vulnerability.patched) {
        unpatched++;
      }
    });
    
    return {
      total: vulnEntries.length,
      bySeverity,
      unpatched,
    };
  }
}
