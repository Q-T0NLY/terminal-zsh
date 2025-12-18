import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { Artifact, Namespace, ManifestWithContent, AuditLog, OperationType } from '../models';
import { z } from 'zod';

/**
 * SQLite storage layer for Hyper Registry
 * Manages persistence of artifacts, namespaces, manifests, and audit logs
 *
 * @module storage/sqlite
 * @see docs/SPECIFICATIONS.md#Persistence_Schema
 */

export interface StorageConfig {
  dataDir?: string;
  dbFile?: string;
  readonly?: boolean;
}

export class SQLiteStorage {
  private db: Database.Database;
  private dataDir: string;

  constructor(config?: StorageConfig) {
    const dataDir = config?.dataDir || join(homedir(), '.hyper-registry');
    const dbFile = config?.dbFile || join(dataDir, 'registry.db');

    // Ensure data directory exists
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    // Open database with optional readonly mode
    this.db = new Database(dbFile, {
      readonly: config?.readonly ?? false,
    });

    this.dataDir = dataDir;

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');

    // Initialize schema
    this.initializeSchema();
  }

  /**
   * Initialize database schema on first connection
   * Creates tables for artifacts, namespaces, manifests, audit logs, and operation stats
   */
  private initializeSchema(): void {
    // Artifacts table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        version TEXT NOT NULL,
        namespace TEXT NOT NULL,
        metadata JSON NOT NULL,
        content_hash TEXT NOT NULL,
        dependencies JSON,
        signature TEXT,
        signed_by TEXT,
        published BOOLEAN DEFAULT FALSE,
        download_count INTEGER DEFAULT 0,
        rating REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(namespace, name, version)
      );
      CREATE INDEX IF NOT EXISTS idx_artifacts_namespace ON artifacts(namespace);
      CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(type);
      CREATE INDEX IF NOT EXISTS idx_artifacts_name ON artifacts(name);
    `);

    // Namespaces table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS namespaces (
        id TEXT PRIMARY KEY,
        path TEXT NOT NULL UNIQUE,
        scope TEXT NOT NULL,
        owner TEXT,
        public BOOLEAN DEFAULT FALSE,
        max_artifacts INTEGER,
        storage_quota INTEGER,
        storage_used INTEGER DEFAULT 0,
        visibility TEXT DEFAULT 'public',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_namespaces_path ON namespaces(path);
      CREATE INDEX IF NOT EXISTS idx_namespaces_scope ON namespaces(scope);
    `);

    // Manifests table (stores all manifest types with polymorphic type field)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS manifests (
        id TEXT PRIMARY KEY,
        artifact_id TEXT NOT NULL,
        manifest_type TEXT NOT NULL,
        manifest_data JSON NOT NULL,
        content TEXT,
        content_format TEXT,
        content_size INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_manifests_artifact ON manifests(artifact_id);
      CREATE INDEX IF NOT EXISTS idx_manifests_type ON manifests(manifest_type);
    `);

    // Audit logs table for operation tracking and compliance
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        operation TEXT NOT NULL,
        actor TEXT NOT NULL,
        namespace TEXT,
        target_id TEXT,
        target_type TEXT,
        changes JSON,
        success BOOLEAN,
        error TEXT,
        ip_address TEXT,
        user_agent TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor);
      CREATE INDEX IF NOT EXISTS idx_audit_operation ON audit_logs(operation);
    `);

    // Operation statistics table for metrics
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS operation_stats (
        operation_type TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0,
        avg_duration_ms REAL DEFAULT 0,
        min_duration_ms INTEGER,
        max_duration_ms INTEGER,
        success_rate REAL DEFAULT 1.0,
        last_executed DATETIME,
        UNIQUE(operation_type)
      );
    `);

    // Initialize operation stats for all known operation types
    const operationTypes: OperationType[] = [
      'create', 'read', 'update', 'delete', 'list', 'search', 'query', 'resolve',
      'publish', 'unpublish', 'deprecate', 'undeprecate', 'archive', 'restore',
      'validate', 'test', 'lint', 'dependency_resolve', 'conflict_detect',
      'dependency_graph', 'migrate', 'upgrade', 'downgrade', 'backup',
      'restore_backup', 'index_rebuild', 'cache_clear'
    ];

    const insertStmt = this.db.prepare(`
      INSERT OR IGNORE INTO operation_stats (operation_type, count, success_rate, last_executed)
      VALUES (?, 0, 1.0, NULL)
    `);

    for (const opType of operationTypes) {
      insertStmt.run(opType);
    }
  }

  /**
   * Store an artifact in the database
   */
  async createArtifact(artifact: z.infer<typeof Artifact>): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO artifacts (
        id, name, type, version, namespace, metadata,
        content_hash, dependencies, signature, signed_by, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      artifact.id,
      artifact.name,
      artifact.type,
      artifact.version,
      artifact.namespace,
      JSON.stringify(artifact.metadata),
      artifact.contentHash,
      artifact.dependencies ? JSON.stringify(artifact.dependencies) : null,
      artifact.signature || null,
      artifact.signedBy || null,
      artifact.published ? 1 : 0
    );
  }

  /**
   * Retrieve an artifact by ID
   */
  async getArtifact(id: string): Promise<Artifact | null> {
    const stmt = this.db.prepare('SELECT * FROM artifacts WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      type: row.type,
      version: row.version,
      namespace: row.namespace,
      metadata: JSON.parse(row.metadata),
      contentHash: row.content_hash,
      dependencies: row.dependencies ? JSON.parse(row.dependencies) : [],
      signature: row.signature,
      signedBy: row.signed_by,
      published: Boolean(row.published),
      downloadCount: row.download_count,
      rating: row.rating,
    };
  }

  /**
   * List artifacts in a namespace
   */
  async listArtifacts(namespace: string, limit: number = 20, offset: number = 0): Promise<Artifact[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM artifacts
      WHERE namespace = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    const rows = stmt.all(namespace, limit, offset) as any[];
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      version: row.version,
      namespace: row.namespace,
      metadata: JSON.parse(row.metadata),
      contentHash: row.content_hash,
      dependencies: row.dependencies ? JSON.parse(row.dependencies) : [],
      signature: row.signature,
      signedBy: row.signed_by,
      published: Boolean(row.published),
      downloadCount: row.download_count,
      rating: row.rating,
    }));
  }

  /**
   * Create a namespace
   */
  async createNamespace(namespace: Namespace): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO namespaces (id, path, scope, owner, public, visibility)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      namespace.id,
      namespace.path,
      namespace.scope,
      namespace.owner || null,
      namespace.public ? 1 : 0,
      namespace.visibility || 'public'
    );
  }

  /**
   * Log an audit entry for compliance and debugging
   */
  async logAudit(audit: AuditLog): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO audit_logs (
        id, timestamp, operation, actor, namespace, target_id,
        target_type, changes, success, error, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      audit.id,
      audit.timestamp,
      audit.operation,
      audit.actor,
      audit.namespace || null,
      audit.targetId || null,
      audit.targetType || null,
      audit.changes ? JSON.stringify(audit.changes) : null,
      audit.success ? 1 : 0,
      audit.error || null,
      audit.ipAddress || null,
      audit.userAgent || null
    );
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    artifactCount: number;
    namespaceCount: number;
    totalSize: number;
  }> {
    const artifactCount = (
      this.db.prepare('SELECT COUNT(*) as count FROM artifacts').get() as any
    ).count;

    const namespaceCount = (
      this.db.prepare('SELECT COUNT(*) as count FROM namespaces').get() as any
    ).count;

    const totalSize = (
      this.db.prepare("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").get() as any
    ).size;

    return { artifactCount, namespaceCount, totalSize };
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }
}
