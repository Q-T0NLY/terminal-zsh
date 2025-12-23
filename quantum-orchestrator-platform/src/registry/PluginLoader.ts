import { Injectable, Logger } from '@nestjs/common';
import {
  IPlugin,
  PluginMetadata,
  PluginStatus,
  DEFAULT_RESOURCE_LIMITS,
  PluginResourceLimits
} from './PluginInterface';

/**
 * Plugin Loader - Dynamic plugin loading with hot reload capability
 */
@Injectable()
export class PluginLoader {
  private readonly logger = new Logger(PluginLoader.name);
  private loadedPlugins = new Map<string, IPlugin>();
  private resourceLimits = new Map<string, PluginResourceLimits>();

  /**
   * Load a plugin dynamically
   */
  async load(
    metadata: PluginMetadata,
    pluginInstance: IPlugin
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Apply resource limits
      this.applyResourceLimits(metadata.id);

      // Initialize plugin
      await pluginInstance.init();

      // Store loaded plugin
      this.loadedPlugins.set(metadata.id, pluginInstance);

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${metadata.id} loaded in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to load plugin ${metadata.id}:`, error);
      throw error;
    }
  }

  /**
   * Unload a plugin
   */
  async unload(pluginId: string): Promise<void> {
    const startTime = Date.now();

    try {
      const plugin = this.loadedPlugins.get(pluginId);

      if (!plugin) {
        throw new Error(`Plugin ${pluginId} is not loaded`);
      }

      // Stop and destroy plugin
      if (plugin.getStatus && plugin.getStatus() === PluginStatus.RUNNING) {
        await plugin.stop();
      }
      await plugin.destroy();

      // Remove from loaded plugins
      this.loadedPlugins.delete(pluginId);
      this.resourceLimits.delete(pluginId);

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${pluginId} unloaded in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to unload plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Reload a plugin (hot reload)
   */
  async reload(
    metadata: PluginMetadata,
    newPluginInstance: IPlugin
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Unload old version
      if (this.loadedPlugins.has(metadata.id)) {
        await this.unload(metadata.id);
      }

      // Load new version
      await this.load(metadata, newPluginInstance);

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${metadata.id} reloaded in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to reload plugin ${metadata.id}:`, error);
      throw error;
    }
  }

  /**
   * Get loaded plugin instance
   */
  getPlugin(pluginId: string): IPlugin | undefined {
    return this.loadedPlugins.get(pluginId);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): Map<string, IPlugin> {
    return new Map(this.loadedPlugins);
  }

  /**
   * Check if plugin is loaded
   */
  isLoaded(pluginId: string): boolean {
    return this.loadedPlugins.has(pluginId);
  }

  /**
   * Start a loaded plugin
   */
  async startPlugin(pluginId: string): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not loaded`);
    }

    await plugin.start();
    this.logger.log(`Plugin ${pluginId} started`);
  }

  /**
   * Stop a loaded plugin
   */
  async stopPlugin(pluginId: string): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not loaded`);
    }

    await plugin.stop();
    this.logger.log(`Plugin ${pluginId} stopped`);
  }

  /**
   * Perform health check on plugin
   */
  async healthCheck(pluginId: string) {
    const plugin = this.loadedPlugins.get(pluginId);

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not loaded`);
    }

    return await plugin.healthCheck();
  }

  /**
   * Apply resource limits to plugin (sandboxing)
   */
  private applyResourceLimits(pluginId: string): void {
    const limits = DEFAULT_RESOURCE_LIMITS;
    this.resourceLimits.set(pluginId, limits);

    this.logger.debug(
      `Applied resource limits to plugin ${pluginId}:`,
      limits
    );
  }

  /**
   * Get resource limits for plugin
   */
  getResourceLimits(pluginId: string): PluginResourceLimits | undefined {
    return this.resourceLimits.get(pluginId);
  }

  /**
   * Update resource limits for plugin
   */
  setResourceLimits(
    pluginId: string,
    limits: Partial<PluginResourceLimits>
  ): void {
    const currentLimits =
      this.resourceLimits.get(pluginId) || DEFAULT_RESOURCE_LIMITS;
    const updatedLimits = { ...currentLimits, ...limits };

    this.resourceLimits.set(pluginId, updatedLimits);
    this.logger.log(`Updated resource limits for plugin ${pluginId}`);
  }

  /**
   * Get loader statistics
   */
  getStats(): {
    totalLoaded: number;
    plugins: string[];
    } {
    return {
      totalLoaded: this.loadedPlugins.size,
      plugins: Array.from(this.loadedPlugins.keys())
    };
  }
}
