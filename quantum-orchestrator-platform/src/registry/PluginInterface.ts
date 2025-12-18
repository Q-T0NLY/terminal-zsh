/**
 * Plugin Interface and Types for Universal Plugin Registry
 */

export enum PluginCategory {
  AI_MODELS = 'AI_MODELS',
  TOOLS = 'TOOLS',
  PROCESSORS = 'PROCESSORS',
  STORAGE = 'STORAGE',
  UI_COMPONENTS = 'UI_COMPONENTS',
}

export enum PluginStatus {
  REGISTERED = 'REGISTERED',
  INITIALIZED = 'INITIALIZED',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  ERROR = 'ERROR',
  DESTROYED = 'DESTROYED',
}

export enum PluginHealthStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNHEALTHY = 'UNHEALTHY',
}

export interface PluginConfig {
  [key: string]: any;
}

export interface PluginHealth {
  status: PluginHealthStatus;
  message?: string;
  timestamp: Date;
  metrics?: {
    cpu?: number;
    memory?: number;
    uptime?: number;
    [key: string]: any;
  };
}

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  category: PluginCategory;
  capabilities: string[];
  dependencies: string[];
  config: PluginConfig;
  status: PluginStatus;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  checksum?: string;
}

export interface IPlugin {
  id: string;
  name: string;
  version: string;
  category: PluginCategory;
  capabilities: string[];
  dependencies: string[];
  config: PluginConfig;

  /**
   * Initialize the plugin with configuration
   */
  init(): Promise<void>;

  /**
   * Start the plugin
   */
  start(): Promise<void>;

  /**
   * Stop the plugin
   */
  stop(): Promise<void>;

  /**
   * Destroy and cleanup plugin resources
   */
  destroy(): Promise<void>;

  /**
   * Perform health check
   */
  healthCheck(): Promise<PluginHealth>;
}

export abstract class BasePlugin implements IPlugin {
  public id: string;
  public name: string;
  public version: string;
  public category: PluginCategory;
  public capabilities: string[];
  public dependencies: string[];
  public config: PluginConfig;

  protected status: PluginStatus = PluginStatus.REGISTERED;
  protected startTime?: Date;

  constructor(metadata: Partial<PluginMetadata>) {
    this.id = metadata.id || '';
    this.name = metadata.name || '';
    this.version = metadata.version || '1.0.0';
    this.category = metadata.category || PluginCategory.TOOLS;
    this.capabilities = metadata.capabilities || [];
    this.dependencies = metadata.dependencies || [];
    this.config = metadata.config || {};
  }

  async init(): Promise<void> {
    this.status = PluginStatus.INITIALIZED;
  }

  async start(): Promise<void> {
    this.status = PluginStatus.RUNNING;
    this.startTime = new Date();
  }

  async stop(): Promise<void> {
    this.status = PluginStatus.STOPPED;
  }

  async destroy(): Promise<void> {
    this.status = PluginStatus.DESTROYED;
    this.startTime = undefined;
  }

  async healthCheck(): Promise<PluginHealth> {
    const uptime = this.startTime
      ? Date.now() - this.startTime.getTime()
      : 0;

    return {
      status: this.status === PluginStatus.RUNNING
        ? PluginHealthStatus.HEALTHY
        : PluginHealthStatus.UNHEALTHY,
      timestamp: new Date(),
      metrics: {
        uptime,
      },
    };
  }

  getStatus(): PluginStatus {
    return this.status;
  }
}

export interface PluginPermissions {
  fileAccess: boolean;
  networkAccess: boolean;
  databaseAccess: boolean;
}

export interface PluginResourceLimits {
  cpuPercent: number; // max CPU usage percent
  memoryMB: number; // max memory in MB
  networkAllowed: boolean;
}

export const DEFAULT_RESOURCE_LIMITS: PluginResourceLimits = {
  cpuPercent: 80,
  memoryMB: 512,
  networkAllowed: true,
};
