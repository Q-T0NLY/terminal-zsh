import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PluginMetadata } from './PluginInterface';
import { PluginEntity } from '../entities/plugin.entity';

/**
 * Plugin Storage - Persistence layer for plugins
 * Integrates with PostgreSQL for metadata and file system for plugin code
 */
@Injectable()
export class PluginStorage {
  private readonly logger = new Logger(PluginStorage.name);
  private cache = new Map<string, PluginMetadata>();

  constructor(
    @InjectRepository(PluginEntity)
    private readonly pluginRepository: Repository<PluginEntity>
  ) {}

  /**
   * Save plugin metadata to database
   */
  async save(metadata: PluginMetadata): Promise<void> {
    const startTime = Date.now();

    try {
      const entity = this.pluginRepository.create({
        id: metadata.id,
        name: metadata.name,
        version: metadata.version,
        description: metadata.description,
        author: metadata.author,
        category: metadata.category,
        capabilities: metadata.capabilities,
        dependencies: metadata.dependencies,
        config: metadata.config,
        status: metadata.status,
        enabled: metadata.enabled,
        checksum: metadata.checksum
      });

      await this.pluginRepository.save(entity);

      // Update cache
      this.cache.set(metadata.id, metadata);

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${metadata.id} saved in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to save plugin ${metadata.id}:`, error);
      throw error;
    }
  }

  /**
   * Get plugin metadata by ID
   */
  async get(id: string): Promise<PluginMetadata | null> {
    const startTime = Date.now();

    try {
      // Check cache first
      if (this.cache.has(id)) {
        const duration = Date.now() - startTime;
        this.logger.debug(`Plugin ${id} retrieved from cache in ${duration}ms`);
        return this.cache.get(id)!;
      }

      // Fetch from database
      const entity = await this.pluginRepository.findOne({ where: { id } });

      if (!entity) {
        return null;
      }

      const metadata = this.entityToMetadata(entity);

      // Update cache
      this.cache.set(id, metadata);

      const duration = Date.now() - startTime;
      this.logger.debug(`Plugin ${id} retrieved from DB in ${duration}ms`);

      return metadata;
    } catch (error) {
      this.logger.error(`Failed to get plugin ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all plugins with optional filters
   */
  async getAll(filters?: {
    category?: string;
    enabled?: boolean;
  }): Promise<PluginMetadata[]> {
    const startTime = Date.now();

    try {
      const queryBuilder = this.pluginRepository.createQueryBuilder('plugin');

      if (filters?.category) {
        queryBuilder.andWhere('plugin.category = :category', {
          category: filters.category
        });
      }

      if (filters?.enabled !== undefined) {
        queryBuilder.andWhere('plugin.enabled = :enabled', {
          enabled: filters.enabled
        });
      }

      const entities = await queryBuilder.getMany();
      const metadata = entities.map((e) => this.entityToMetadata(e));

      const duration = Date.now() - startTime;
      this.logger.log(`Retrieved ${metadata.length} plugins in ${duration}ms`);

      return metadata;
    } catch (error) {
      this.logger.error('Failed to get all plugins:', error);
      throw error;
    }
  }

  /**
   * Update plugin metadata
   */
  async update(id: string, updates: Partial<PluginMetadata>): Promise<void> {
    const startTime = Date.now();

    try {
      await this.pluginRepository.update({ id }, updates as any);

      // Invalidate cache
      this.cache.delete(id);

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${id} updated in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to update plugin ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete plugin metadata
   */
  async delete(id: string): Promise<void> {
    const startTime = Date.now();

    try {
      await this.pluginRepository.delete({ id });

      // Remove from cache
      this.cache.delete(id);

      const duration = Date.now() - startTime;
      this.logger.log(`Plugin ${id} deleted in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to delete plugin ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get plugin version history
   */
  async getVersionHistory(name: string): Promise<PluginMetadata[]> {
    try {
      const entities = await this.pluginRepository.find({
        where: { name },
        order: { createdAt: 'DESC' }
      });

      return entities.map((e) => this.entityToMetadata(e));
    } catch (error) {
      this.logger.error(`Failed to get version history for ${name}:`, error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.log('Plugin cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Convert database entity to PluginMetadata
   */
  private entityToMetadata(entity: PluginEntity): PluginMetadata {
    return {
      id: entity.id,
      name: entity.name,
      version: entity.version,
      description: entity.description,
      author: entity.author,
      category: entity.category,
      capabilities: entity.capabilities,
      dependencies: entity.dependencies,
      config: entity.config,
      status: entity.status,
      enabled: entity.enabled,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      checksum: entity.checksum
    };
  }
}
