/**
 * 🔌 Plugin Registry - WASM/Sandboxed Plugin Management
 */

import {
  SubRegistryType,
  PluginRegistryEntry,
  SubRegistryConfig,
  SubRegistryQuery,
  SubRegistryResult,
} from '../models/sub-registry';
import { ISubRegistry } from './orchestrator';

export class PluginRegistry implements ISubRegistry<PluginRegistryEntry> {
  readonly type = SubRegistryType.PLUGIN;
  readonly config: SubRegistryConfig;
  
  private entries: Map<string, PluginRegistryEntry> = new Map();
  private runtimeCache: Map<string, any> = new Map();
  
  constructor(config?: Partial<SubRegistryConfig>) {
    this.config = {
      type: SubRegistryType.PLUGIN,
      enabled: true,
      indexing: {
        enabled: true,
        fields: ['name', 'runtime', 'permissions', 'exports'],
      },
      validation: {
        strict: true,
        customValidators: [
          this.validateWasmBinary.bind(this),
          this.validatePermissions.bind(this),
          this.validateSandboxing.bind(this),
        ],
      },
      storage: {
        backend: 'sqlite',
        path: './plugin-registry.db',
      },
      ...config,
    };
  }

  async initialize(): Promise<void> {
    // Initialize WASM runtime environment
    console.log('🔌 Initializing Plugin Registry with WASM support');
    this.runtimeCache.clear();
  }

  async register(entry: PluginRegistryEntry): Promise<string> {
    const id = `plugin-${entry.namespace}:${entry.name}`;
    
    // Validate plugin entry
    const isValid = await this.validate(entry);
    if (!isValid) {
      throw new Error(`Plugin validation failed for ${id}`);
    }
    
    // Store plugin
    this.entries.set(id, entry);
    
    // Pre-compile WASM if available
    if (entry.wasmBinary && entry.metadata.runtime === 'wasm') {
      await this.precompileWasm(id, entry.wasmBinary);
    }
    
    return id;
  }

  async query(query: SubRegistryQuery): Promise<SubRegistryResult<PluginRegistryEntry>> {
    let results = Array.from(this.entries.values());
    
    // Apply filters
    if (query.namespace) {
      results = results.filter(e => e.namespace === query.namespace);
    }
    if (query.tags) {
      results = results.filter(e =>
        query.tags!.some(tag => e.metadata.tags.includes(tag))
      );
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

  async get(id: string): Promise<PluginRegistryEntry | null> {
    return this.entries.get(id) || null;
  }

  async update(id: string, entry: Partial<PluginRegistryEntry>): Promise<boolean> {
    const existing = this.entries.get(id);
    if (!existing) return false;
    
    this.entries.set(id, { ...existing, ...entry } as PluginRegistryEntry);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return this.entries.delete(id);
  }

  async validate(entry: PluginRegistryEntry): Promise<boolean> {
    // Run all validators
    for (const validator of this.config.validation.customValidators || []) {
      if (!validator(entry)) {
        return false;
      }
    }
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return this.entries.size >= 0; // Basic health check
  }

  private validateWasmBinary(entry: PluginRegistryEntry): boolean {
    if (entry.metadata.runtime === 'wasm' && !entry.wasmBinary) {
      return false;
    }
    return true;
  }

  private validatePermissions(entry: PluginRegistryEntry): boolean {
    const validPermissions = [
      'fs:read', 'fs:write', 'network:http', 'network:https',
      'env:read', 'env:write', 'crypto', 'db:read', 'db:write',
    ];
    return entry.metadata.permissions.every(p => validPermissions.includes(p));
  }

  private validateSandboxing(entry: PluginRegistryEntry): boolean {
    if (entry.metadata.sandbox === 'none') {
      // Warn about security implications
      console.warn(`⚠️  Plugin ${entry.name} runs without sandboxing`);
    }
    return true;
  }

  private async precompileWasm(id: string, binary: Uint8Array): Promise<void> {
    try {
      const module = await WebAssembly.compile(binary);
      this.runtimeCache.set(id, module);
      console.log(`✅ Pre-compiled WASM module for ${id}`);
    } catch (error) {
      console.error(`Failed to pre-compile WASM for ${id}:`, error);
    }
  }
}
