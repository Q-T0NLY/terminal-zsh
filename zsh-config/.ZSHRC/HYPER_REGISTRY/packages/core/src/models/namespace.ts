/**
 * Namespace Model - Hierarchical organization for artifacts
 * 
 * @module models/namespace
 * @see SPECIFICATIONS.md for namespace organization rules
 */

import { z } from 'zod';

/**
 * Namespace hierarchy levels
 * 
 * Examples:
 * - global/nexuspro (global namespace)
 * - system/core (system services)
 * - library/algorithms (shared libraries)
 * - orgs/acme/projects/api (organization hierarchy)
 * - users/alice/local (user personal namespace)
 * - local/* (local-only namespace)
 */
export enum NamespaceScope {
  GLOBAL = 'global',
  SYSTEM = 'system',
  LIBRARY = 'library',
  ORGANIZATION = 'orgs',
  USER = 'users',
  LOCAL = 'local',
}

/**
 * Namespace schema - Defines namespace hierarchy and rules
 */
export const NamespaceSchema = z.object({
  id: z.string().uuid().describe('UUIDv7 unique identifier'),
  path: z.string().regex(/^[a-z0-9/-]+$/).describe('Full namespace path'),
  scope: z.nativeEnum(NamespaceScope),
  owner: z.string().optional().describe('Owner user/org ID'),
  
  // Metadata
  created: z.date(),
  updated: z.date(),
  
  // Settings
  public: z.boolean().default(true),
  maxArtifacts: z.number().int().optional().describe('Max artifacts in namespace'),
  
  // Quotas
  storageQuota: z.number().int().optional().describe('Storage limit in bytes'),
  storageUsed: z.number().int().nonnegative().default(0),
  
  // Access control
  visibility: z.enum(['public', 'private', 'internal']).default('public'),
});

export type Namespace = z.infer<typeof NamespaceSchema>;

/**
 * Validate namespace path
 */
export function validateNamespacePath(path: string): boolean {
  return /^[a-z0-9/-]+$/.test(path);
}

/**
 * Parse namespace hierarchy
 * 
 * @example
 * parseNamespace('orgs/acme/projects/api')
 * // => { scope: 'orgs', segments: ['acme', 'projects', 'api'] }
 */
export function parseNamespace(path: string): {
  scope: NamespaceScope;
  segments: string[];
} {
  const [scopePart, ...segments] = path.split('/');
  
  // Map string to enum
  const scope = Object.values(NamespaceScope).includes(scopePart as NamespaceScope)
    ? (scopePart as NamespaceScope)
    : NamespaceScope.LOCAL;
  
  return { scope, segments };
}

/**
 * Check if namespace is parent of another
 * 
 * @example
 * isParentNamespace('orgs/acme', 'orgs/acme/projects/api')
 * // => true
 */
export function isParentNamespace(parent: string, child: string): boolean {
  return child.startsWith(parent + '/');
}

/**
 * Get parent namespace path
 * 
 * @example
 * getParentNamespace('orgs/acme/projects/api')
 * // => 'orgs/acme/projects'
 */
export function getParentNamespace(path: string): string | null {
  const segments = path.split('/');
  if (segments.length <= 1) return null;
  return segments.slice(0, -1).join('/');
}

/**
 * Create namespace path for organization
 */
export function createOrgNamespace(orgId: string, ...segments: string[]): string {
  return `${NamespaceScope.ORGANIZATION}/${orgId}/${segments.join('/')}`;
}

/**
 * Create namespace path for user
 */
export function createUserNamespace(userId: string, ...segments: string[]): string {
  return `${NamespaceScope.USER}/${userId}/${segments.join('/')}`;
}

/**
 * Create global namespace path
 */
export function createGlobalNamespace(...segments: string[]): string {
  return `${NamespaceScope.GLOBAL}/${segments.join('/')}`;
}
