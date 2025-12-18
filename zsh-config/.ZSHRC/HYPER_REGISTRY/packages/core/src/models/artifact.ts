/**
 * Artifact Model - Core entity in Hyper Registry
 * Represents plugins, services, configurations, and templates
 * 
 * @module models/artifact
 * @see SPECIFICATIONS.md for complete data model documentation
 */

import { z } from 'zod';

/**
 * Artifact types supported by the registry
 */
export enum ArtifactType {
  PLUGIN = 'plugin',
  SERVICE = 'service',
  CONFIG = 'config',
  TEMPLATE = 'template',
  LIBRARY = 'library',
  THEME = 'theme',
}

/**
 * Metadata schema - Common metadata for all artifacts
 */
export const MetadataSchema = z.object({
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string(),
  licenses: z.array(z.string()).default(['MIT']),
  created: z.date(),
  updated: z.date(),
  deprecated: z.boolean().default(false),
  deprecationMessage: z.string().optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;

/**
 * Artifact schema - Main registry entity
 */
export const ArtifactSchema = z.object({
  // Identifiers
  id: z.string().uuid().describe('UUIDv7 unique identifier'),
  name: z.string().min(1).max(255).describe('Artifact name'),
  type: z.nativeEnum(ArtifactType).describe('Artifact type'),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?$/).describe('Semantic version'),
  
  // Organization
  namespace: z.string().describe('Hierarchical namespace (e.g., orgs/acme/projects/api)'),
  
  // Content
  metadata: MetadataSchema,
  contentHash: z.string().describe('SHA-256 hash of artifact content'),
  
  // Relationships
  dependencies: z.array(z.object({
    name: z.string(),
    version: z.string(),
    optional: z.boolean().default(false),
  })).default([]),
  
  // Security
  signature: z.string().optional().describe('Ed25519 signature'),
  signedBy: z.string().optional().describe('Signature issuer'),
  
  // Lifecycle
  published: z.boolean().default(false),
  downloadCount: z.number().int().nonnegative().default(0),
  rating: z.number().min(0).max(5).optional(),
});

export type Artifact = z.infer<typeof ArtifactSchema>;

/**
 * Validate artifact against schema
 */
export function validateArtifact(data: unknown): Artifact {
  return ArtifactSchema.parse(data);
}

/**
 * Partial artifact for creation (some fields optional)
 */
export const ArtifactCreateSchema = ArtifactSchema.omit({
  id: true,
  contentHash: true,
  downloadCount: true,
  metadata: true,
}).merge(z.object({
  metadata: MetadataSchema.omit({ created: true, updated: true }),
}));

export type ArtifactCreate = z.infer<typeof ArtifactCreateSchema>;
