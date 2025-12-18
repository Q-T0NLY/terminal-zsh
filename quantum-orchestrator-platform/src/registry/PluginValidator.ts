import { Injectable, Logger } from '@nestjs/common';
import { PluginMetadata, PluginConfig } from './PluginInterface';

/**
 * Plugin Validator - Validates plugin schema, dependencies, security, and configuration
 */
@Injectable()
export class PluginValidator {
  private readonly logger = new Logger(PluginValidator.name);

  /**
   * Validate plugin metadata
   */
  async validateMetadata(metadata: Partial<PluginMetadata>): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Required fields validation
    if (!metadata.id) {
      errors.push('Plugin ID is required');
    }
    if (!metadata.name) {
      errors.push('Plugin name is required');
    }
    if (!metadata.version) {
      errors.push('Plugin version is required');
    }
    if (!metadata.category) {
      errors.push('Plugin category is required');
    }

    // Version format validation
    if (metadata.version && !this.isValidVersion(metadata.version)) {
      errors.push('Invalid version format. Use semver (e.g., 1.0.0)');
    }

    // ID format validation
    if (metadata.id && !this.isValidPluginId(metadata.id)) {
      errors.push('Invalid plugin ID format. Use alphanumeric characters, dashes, and underscores');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate plugin dependencies
   */
  async validateDependencies(
    dependencies: string[],
    availablePlugins: Map<string, PluginMetadata>,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const dep of dependencies) {
      if (!availablePlugins.has(dep)) {
        errors.push(`Missing dependency: ${dep}`);
      }
    }

    // Check for circular dependencies
    const circular = this.detectCircularDependencies(dependencies, availablePlugins);
    if (circular.length > 0) {
      errors.push(`Circular dependencies detected: ${circular.join(' -> ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate plugin configuration
   */
  async validateConfig(config: PluginConfig): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Check if config is a valid object
    if (typeof config !== 'object' || config === null) {
      errors.push('Config must be a valid object');
    }

    // Max config size check (100KB)
    const configSize = JSON.stringify(config).length;
    if (configSize > 100 * 1024) {
      errors.push(`Config size exceeds limit: ${configSize} bytes (max: 100KB)`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Security validation - checksum verification
   */
  async validateSecurity(
    metadata: PluginMetadata,
    providedChecksum?: string,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Checksum validation
    if (metadata.checksum && providedChecksum) {
      if (metadata.checksum !== providedChecksum) {
        errors.push('Checksum mismatch - security validation failed');
      }
    }

    // Validate capabilities
    const validCapabilities = this.validateCapabilities(metadata.capabilities);
    if (!validCapabilities.valid) {
      errors.push(...validCapabilities.errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Comprehensive plugin validation
   */
  async validate(
    metadata: Partial<PluginMetadata>,
    availablePlugins: Map<string, PluginMetadata> = new Map(),
    checksum?: string,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const allErrors: string[] = [];

    // Metadata validation
    const metadataResult = await this.validateMetadata(metadata);
    allErrors.push(...metadataResult.errors);

    // Dependencies validation
    if (metadata.dependencies && metadata.dependencies.length > 0) {
      const depsResult = await this.validateDependencies(
        metadata.dependencies,
        availablePlugins,
      );
      allErrors.push(...depsResult.errors);
    }

    // Config validation
    if (metadata.config) {
      const configResult = await this.validateConfig(metadata.config);
      allErrors.push(...configResult.errors);
    }

    // Security validation
    if (metadata as PluginMetadata) {
      const securityResult = await this.validateSecurity(
        metadata as PluginMetadata,
        checksum,
      );
      allErrors.push(...securityResult.errors);
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  /**
   * Validate version format (semver)
   */
  private isValidVersion(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?$/;
    return semverRegex.test(version);
  }

  /**
   * Validate plugin ID format
   */
  private isValidPluginId(id: string): boolean {
    const idRegex = /^[a-zA-Z0-9_-]+$/;
    return idRegex.test(id);
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(
    dependencies: string[],
    availablePlugins: Map<string, PluginMetadata>,
  ): string[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const dep of dependencies) {
      if (this.hasCycle(dep, availablePlugins, visited, recursionStack)) {
        return Array.from(recursionStack);
      }
    }

    return [];
  }

  /**
   * Check for cycle in dependency graph
   */
  private hasCycle(
    pluginId: string,
    availablePlugins: Map<string, PluginMetadata>,
    visited: Set<string>,
    recursionStack: Set<string>,
  ): boolean {
    if (recursionStack.has(pluginId)) {
      return true;
    }

    if (visited.has(pluginId)) {
      return false;
    }

    visited.add(pluginId);
    recursionStack.add(pluginId);

    const plugin = availablePlugins.get(pluginId);
    if (plugin && plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (this.hasCycle(dep, availablePlugins, visited, recursionStack)) {
          return true;
        }
      }
    }

    recursionStack.delete(pluginId);
    return false;
  }

  /**
   * Validate capabilities
   */
  private validateCapabilities(capabilities: string[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const validCapabilityPattern = /^[a-zA-Z0-9_-]+$/;

    for (const capability of capabilities) {
      if (!validCapabilityPattern.test(capability)) {
        errors.push(`Invalid capability format: ${capability}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
