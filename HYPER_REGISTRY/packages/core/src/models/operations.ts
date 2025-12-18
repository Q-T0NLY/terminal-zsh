/**
 * Operations Model - Registry operations and lifecycle
 * 
 * @module models/operations
 * @see SPECIFICATIONS.md for registry operations documentation
 */

import { z } from 'zod';

/**
 * Registry operation types
 */
export enum OperationType {
  // CRUD
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  
  // Discovery
  LIST = 'list',
  SEARCH = 'search',
  QUERY = 'query',
  RESOLVE = 'resolve',
  
  // Lifecycle
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  DEPRECATE = 'deprecate',
  UNDEPRECATE = 'undeprecate',
  ARCHIVE = 'archive',
  RESTORE = 'restore',
  
  // Validation
  VALIDATE = 'validate',
  TEST = 'test',
  LINT = 'lint',
  
  // Relationships
  DEPENDENCY_RESOLVE = 'dependency_resolve',
  CONFLICT_DETECT = 'conflict_detect',
  DEPENDENCY_GRAPH = 'dependency_graph',
  
  // Migration
  MIGRATE = 'migrate',
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
  
  // Admin
  BACKUP = 'backup',
  RESTORE_BACKUP = 'restore_backup',
  INDEX_REBUILD = 'index_rebuild',
  CACHE_CLEAR = 'cache_clear',
}

/**
 * Operation request schema
 */
export const OperationRequestSchema = z.object({
  id: z.string().uuid().describe('Request unique ID'),
  type: z.nativeEnum(OperationType),
  timestamp: z.date(),
  
  // Context
  actor: z.string().describe('User/service performing operation'),
  namespace: z.string().optional(),
  
  // Parameters
  params: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  
  // Tracing
  traceId: z.string().optional(),
  correlationId: z.string().optional(),
});

export type OperationRequest = z.infer<typeof OperationRequestSchema>;

/**
 * Operation result schema
 */
export const OperationResultSchema = z.object({
  requestId: z.string().uuid(),
  success: z.boolean(),
  timestamp: z.date(),
  
  // Outcome
  data: z.any().optional().describe('Operation result data'),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }).optional(),
  
  // Metrics
  duration: z.number().describe('Duration in milliseconds'),
  itemsAffected: z.number().int().nonnegative().optional(),
});

export type OperationResult = z.infer<typeof OperationResultSchema>;

/**
 * Create artifact operation
 */
export const CreateArtifactOpSchema = OperationRequestSchema.extend({
  type: z.literal(OperationType.CREATE),
  params: z.object({
    artifactType: z.string(),
    name: z.string(),
    namespace: z.string(),
    version: z.string(),
    metadata: z.record(z.any()).optional(),
  }),
});

/**
 * Publish artifact operation
 */
export const PublishArtifactOpSchema = OperationRequestSchema.extend({
  type: z.literal(OperationType.PUBLISH),
  params: z.object({
    artifactId: z.string().uuid(),
    version: z.string().optional(),
  }),
});

/**
 * Search operation
 */
export const SearchOpSchema = OperationRequestSchema.extend({
  type: z.literal(OperationType.SEARCH),
  params: z.object({
    query: z.string(),
    namespace: z.string().optional(),
    filters: z.record(z.any()).optional(),
    limit: z.number().int().positive().default(20),
    offset: z.number().int().nonnegative().default(0),
  }),
});

/**
 * Validate artifact operation
 */
export const ValidateOpSchema = OperationRequestSchema.extend({
  type: z.literal(OperationType.VALIDATE),
  params: z.object({
    artifactId: z.string().uuid(),
    strict: z.boolean().default(true),
  }),
});

/**
 * Resolve dependencies operation
 */
export const ResolveDependenciesOpSchema = OperationRequestSchema.extend({
  type: z.literal(OperationType.DEPENDENCY_RESOLVE),
  params: z.object({
    artifactId: z.string().uuid(),
    version: z.string(),
    strategy: z.enum(['latest', 'compatible', 'exact']).default('compatible'),
  }),
});

/**
 * Audit log entry
 */
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.date(),
  
  operation: z.nativeEnum(OperationType),
  actor: z.string(),
  namespace: z.string().optional(),
  
  // What changed
  targetId: z.string().optional(),
  targetType: z.string().optional(),
  
  // How it changed
  changes: z.array(z.object({
    field: z.string(),
    old: z.any().optional(),
    new: z.any().optional(),
  })).default([]),
  
  // Outcome
  success: z.boolean(),
  error: z.string().optional(),
  
  // Context
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type AuditLogEntry = z.infer<typeof AuditLogSchema>;

/**
 * Operation stats/metrics
 */
export const OperationStatsSchema = z.object({
  operationType: z.nativeEnum(OperationType),
  count: z.number().int().nonnegative(),
  avgDuration: z.number(),
  minDuration: z.number(),
  maxDuration: z.number(),
  successRate: z.number().min(0).max(1),
  lastExecuted: z.date(),
});

export type OperationStats = z.infer<typeof OperationStatsSchema>;
