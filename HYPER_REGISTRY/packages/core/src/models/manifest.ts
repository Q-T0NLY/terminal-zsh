/**
 * Artifact Manifest Model - Full definition of an artifact including content
 * 
 * @module models/manifest
 * @see SPECIFICATIONS.md for manifest schema documentation
 */

import { z } from 'zod';
import { ArtifactSchema } from './artifact';

/**
 * Plugin manifest - Extends artifact with plugin-specific metadata
 */
export const PluginManifestSchema = ArtifactSchema.extend({
  entrypoint: z.string().describe('Main plugin file path'),
  
  capabilities: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    version: z.string(),
  })).describe('Plugin capabilities/hooks'),
  
  configuration: z.record(z.any()).optional().describe('Plugin configuration schema'),
  
  hooks: z.array(z.enum([
    'on-load',
    'on-unload',
    'on-activate',
    'on-deactivate',
    'on-update',
    'on-install',
    'on-remove',
  ])).default([]).describe('Supported lifecycle hooks'),
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

/**
 * Service manifest - Extends artifact with service-specific metadata
 */
export const ServiceManifestSchema = ArtifactSchema.extend({
  serviceType: z.enum(['grpc', 'rest', 'graphql', 'websocket']),
  
  endpoints: z.array(z.object({
    name: z.string(),
    path: z.string(),
    method: z.string(),
    description: z.string().optional(),
  })).describe('Service endpoints'),
  
  health: z.object({
    endpoint: z.string(),
    interval: z.number(),
    timeout: z.number(),
  }).optional(),
  
  scalable: z.boolean().default(false),
});

export type ServiceManifest = z.infer<typeof ServiceManifestSchema>;

/**
 * Config manifest - Extends artifact with config-specific metadata
 */
export const ConfigManifestSchema = ArtifactSchema.extend({
  configType: z.enum(['json', 'yaml', 'toml', 'env', 'hcl']),
  
  schema: z.record(z.any()).describe('Configuration schema/validation'),
  
  environment: z.enum(['dev', 'staging', 'prod', 'all']).default('all'),
  
  validation: z.object({
    strict: z.boolean().default(true),
    requireAll: z.boolean().default(false),
  }).optional(),
});

export type ConfigManifest = z.infer<typeof ConfigManifestSchema>;

/**
 * Template manifest - Extends artifact with template-specific metadata
 */
export const TemplateManifestSchema = ArtifactSchema.extend({
  templateType: z.enum(['starter', 'component', 'workflow', 'custom']),
  
  parameters: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
    required: z.boolean().default(false),
    default: z.any().optional(),
    description: z.string().optional(),
  })).default([]).describe('Template parameters'),
  
  files: z.array(z.object({
    path: z.string(),
    template: z.boolean().default(true),
    size: z.number().optional(),
  })).describe('Template files'),
  
  postInstall: z.string().optional().describe('Post-install script'),
});

export type TemplateManifest = z.infer<typeof TemplateManifestSchema>;

/**
 * Union of all manifest types
 */
export const ManifestSchema = z.union([
  PluginManifestSchema,
  ServiceManifestSchema,
  ConfigManifestSchema,
  TemplateManifestSchema,
  ArtifactSchema,
]);

export type Manifest = z.infer<typeof ManifestSchema>;

/**
 * Manifest with embedded content
 */
export const ManifestWithContentSchema = ManifestSchema.extend({
  content: z.union([
    z.string().describe('Text content or base64 encoded'),
    z.record(z.any()).describe('JSON/object content'),
  ]).optional(),
  
  contentFormat: z.enum(['text', 'base64', 'json', 'binary']).default('text'),
  
  contentSize: z.number().optional(),
});

export type ManifestWithContent = z.infer<typeof ManifestWithContentSchema>;

/**
 * Manifest metadata for indexing/search
 */
export const ManifestMetadataSchema = z.object({
  artifactId: z.string().uuid(),
  version: z.string(),
  lastIndexed: z.date(),
  indexed: z.boolean().default(true),
  searchTerms: z.array(z.string()).default([]),
  facets: z.record(z.array(z.string())).default({}),
});

export type ManifestMetadata = z.infer<typeof ManifestMetadataSchema>;

/**
 * Validate manifest against its type
 */
export function validateManifest(data: unknown, type?: string): Manifest {
  return ManifestSchema.parse(data);
}

/**
 * Get manifest type from artifact type
 */
export function getManifestSchema(artifactType: string) {
  const typeMap = {
    plugin: PluginManifestSchema,
    service: ServiceManifestSchema,
    config: ConfigManifestSchema,
    template: TemplateManifestSchema,
  };
  return typeMap[artifactType as keyof typeof typeMap] || ArtifactSchema;
}
