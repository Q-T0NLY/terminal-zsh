import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { IPlugin, PluginMetadata, PluginStatus, PluginCategory } from './PluginInterface';
import { PluginStorage } from './PluginStorage';
import { PluginValidator } from './PluginValidator';
import { PluginLoader } from './PluginLoader';

/**
 * Universal Registry - Core registry engine for plugin management
 */
@Injectable()
export class UniversalRegistry {
  private readonly logger = new Logger(UniversalRegistry.name);

  constructor(
    private readonly storage: PluginStorage,
    private readonly validator: PluginValidator,
    private readonly loader: PluginLoader
  ) {}

  /**
   * Register a new plugin
   */
  async registerPlugin(
    metadata: Partial<PluginMetadata>,
    pluginInstance: IPlugin
  ): Promise<PluginMetadata> {
    const startTime = Date.now();

    try {
      // Generate ID if not provided
      if (!metadata.id) {
        metadata.id = this.generatePluginId(metadata.name!);
      }

      // Check if plugin already exists
      const existing = await this.storage.get(metadata.id);
      if (existing) {
        throw new ConflictException(`Plugin ${metadata.id} already exists`);
      }

      // Validate plugin
      const availablePlugins = await this.getAvailablePlugins();
      const validation = await this.validator.validate(
        metadata,
        availablePlugins,
        metadata.checksum
      );

      if (!validation.valid) {
        throw new Error(
          `Plugin validation failed: ${validation.errors.join(', ')}`
        );
      }

      // Complete metadata
      const completeMetadata: PluginMetadata = {
        id: metadata.id,
        name: metadata.name!,
        version: metadata.version!,
        description: metadata.description,
        author: metadata.author,
        category: metadata.category!,
        capabilities: metadata.capabilities || [],
        dependencies: metadata.dependencies || [],
        config: metadata.config || {},
        status: PluginStatus.REGISTERED,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        checksum: metadata.checksum
      };

      // Save to storage
      await this.storage.save(completeMetadata);

      // Load plugin
      await this.loader.load(completeMetadata, pluginInstance);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Plugin ${completeMetadata.id} registered successfully in ${duration}ms`
      );

      return completeMetadata;
    } catch (error) {
      this.logger.error('Failed to register plugin:', error);
      throw error;
    }
  }

  /**
   * Unregister a plugin
   */
  async unregisterPlugin(pluginId: string): Promise<void> {
    const startTime = Date.now();

    try {
      // Check if plugin exists
      const plugin = await this.storage.get(pluginId);
      if (!plugin) {
        throw new NotFoundException(`Plugin ${pluginId} not found`);
      }

      // Check dependencies - don't allow removal if other plugins depend on it
      const allPlugins = await this.storage.getAll();
      const dependents = allPlugins.filter((p) =>
        p.dependencies.includes(pluginId)
      );

      if (dependents.length > 0) {
        throw new ConflictException(
          `Cannot unregister plugin ${pluginId}. It is required by: ${dependents.map((p) => p.id).join(', ')}`
        );
      }

      // Unload if loaded
      if (this.loader.isLoaded(pluginId)) {
        await this.loader.unload(pluginId);
      }

      // Delete from storage
      await this.storage.delete(pluginId);

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${pluginId} unregistered in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to unregister plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Get plugin details
   */
  async getPlugin(pluginId: string): Promise<PluginMetadata> {
    const startTime = Date.now();

    try {
      const plugin = await this.storage.get(pluginId);

      if (!plugin) {
        throw new NotFoundException(`Plugin ${pluginId} not found`);
      }

      const duration = Date.now() - startTime;
      this.logger.debug(`Retrieved plugin ${pluginId} in ${duration}ms`);

      return plugin;
    } catch (error) {
      this.logger.error(`Failed to get plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * List all plugins with filters
   */
  async listPlugins(filters?: {
    category?: PluginCategory;
    enabled?: boolean;
  }): Promise<PluginMetadata[]> {
    const startTime = Date.now();

    try {
      const plugins = await this.storage.getAll(filters);

      const duration = Date.now() - startTime;
      this.logger.debug(`Listed ${plugins.length} plugins in ${duration}ms`);

      return plugins;
    } catch (error) {
      this.logger.error('Failed to list plugins:', error);
      throw error;
    }
  }

  /**
   * Update plugin metadata
   */
  async updatePlugin(
    pluginId: string,
    updates: Partial<PluginMetadata>
  ): Promise<PluginMetadata> {
    const startTime = Date.now();

    try {
      const existing = await this.storage.get(pluginId);

      if (!existing) {
        throw new NotFoundException(`Plugin ${pluginId} not found`);
      }

      // Validate updates
      const updatedMetadata = { ...existing, ...updates };
      const availablePlugins = await this.getAvailablePlugins();
      const validation = await this.validator.validate(
        updatedMetadata,
        availablePlugins
      );

      if (!validation.valid) {
        throw new Error(
          `Plugin update validation failed: ${validation.errors.join(', ')}`
        );
      }

      // Update storage
      await this.storage.update(pluginId, updates);

      // Get updated metadata
      const updated = await this.storage.get(pluginId);

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${pluginId} updated in ${duration}ms`);

      return updated!;
    } catch (error) {
      this.logger.error(`Failed to update plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Enable a plugin
   */
  async enablePlugin(pluginId: string): Promise<void> {
    const startTime = Date.now();

    try {
      await this.storage.update(pluginId, { enabled: true });

      // Start if loaded
      if (this.loader.isLoaded(pluginId)) {
        await this.loader.startPlugin(pluginId);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${pluginId} enabled in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to enable plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Disable a plugin
   */
  async disablePlugin(pluginId: string): Promise<void> {
    const startTime = Date.now();

    try {
      await this.storage.update(pluginId, { enabled: false });

      // Stop if loaded
      if (this.loader.isLoaded(pluginId)) {
        await this.loader.stopPlugin(pluginId);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${pluginId} disabled in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to disable plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Perform health check on plugin
   */
  async healthCheck(pluginId: string) {
    const startTime = Date.now();

    try {
      if (!this.loader.isLoaded(pluginId)) {
        throw new Error(`Plugin ${pluginId} is not loaded`);
      }

      const health = await this.loader.healthCheck(pluginId);

      const duration = Date.now() - startTime;
      this.logger.debug(`Health check for ${pluginId} completed in ${duration}ms`);

      return health;
    } catch (error) {
      this.logger.error(`Health check failed for plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * List all plugin categories
   */
  async listCategories(): Promise<string[]> {
    return Object.values(PluginCategory);
  }

  /**
   * Search plugins by name, category, or capabilities
   */
  async searchPlugins(query: {
    name?: string;
    category?: PluginCategory;
    capabilities?: string[];
  }): Promise<PluginMetadata[]> {
    const startTime = Date.now();

    try {
      let plugins = await this.storage.getAll();

      // Filter by name
      if (query.name) {
        const searchTerm = query.name.toLowerCase();
        plugins = plugins.filter((p) =>
          p.name.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by category
      if (query.category != null) {
        plugins = plugins.filter((p) => p.category === query.category);
      }

      // Filter by capabilities
      if (query.capabilities && query.capabilities.length > 0) {
        plugins = plugins.filter((p) =>
          query.capabilities!.some((cap) => p.capabilities.includes(cap))
        );
      }

      const duration = Date.now() - startTime;
      this.logger.debug(`Search completed in ${duration}ms, found ${plugins.length} plugins`);

      return plugins;
    } catch (error) {
      this.logger.error('Failed to search plugins:', error);
      throw error;
    }
  }

  /**
   * Get plugin instance (for execution)
   */
  getPluginInstance(pluginId: string): IPlugin | undefined {
    return this.loader.getPlugin(pluginId);
  }

  /**
   * Generate a unique plugin ID
   */
  private generatePluginId(name: string): string {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now().toString(36);
    return `${normalized}-${timestamp}`;
  }

  /**
   * Get available plugins as a map
   */
  private async getAvailablePlugins(): Promise<Map<string, PluginMetadata>> {
    const plugins = await this.storage.getAll();
    const map = new Map<string, PluginMetadata>();

    for (const plugin of plugins) {
      map.set(plugin.id, plugin);
    }

    return map;
  }

  /**
   * Get registry statistics
   */
  async getStats(): Promise<{
    totalPlugins: number;
    loadedPlugins: number;
    enabledPlugins: number;
    categories: Record<string, number>;
  }> {
    const allPlugins = await this.storage.getAll();
    const loaderStats = this.loader.getStats();

    const categories: Record<string, number> = {};
    for (const plugin of allPlugins) {
      categories[plugin.category] = (categories[plugin.category] || 0) + 1;
    }

    return {
      totalPlugins: allPlugins.length,
      loadedPlugins: loaderStats.totalLoaded,
      enabledPlugins: allPlugins.filter((p) => p.enabled).length,
      categories
    };
  }
}
