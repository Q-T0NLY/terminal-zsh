# Hyper Registry - Technical Specifications

## Table of Contents

1. [Data Models](#data-models)
2. [Namespace Hierarchy](#namespace-hierarchy)
3. [Versioning Strategy](#versioning-strategy)
4. [Operations Reference](#operations-reference)
5. [Persistence Schema](#persistence-schema)
6. [Search & Discovery](#search--discovery)
7. [Authentication & Authorization](#authentication--authorization)
8. [gRPC Services](#grpc-services)
9. [Plugin System](#plugin-system)
10. [Microservices Mesh](#microservices-mesh)

---

## Data Models

### Artifact

The fundamental data structure representing any sharable content in the registry.

**Schema:**
```typescript
interface Artifact {
  id: string;                    // UUIDv7, immutable
  name: string;                  // Semantic identifier (e.g., 'react-plugin')
  type: 'plugin' | 'service' | 'config' | 'template' | 'library' | 'theme';
  version: string;               // Semantic versioning (e.g., '1.2.3')
  namespace: string;             // Hierarchical path (e.g., 'org.team.project')
  metadata: {
    description?: string;
    author?: string;
    license?: string;
    tags?: string[];
    homepage?: string;
    repository?: string;
    keywords?: string[];
  };
  contentHash: string;           // SHA-256 of artifact content
  dependencies?: {
    [namespace_path: string]: string;  // Dependencies with version constraints
  };
  signature?: string;            // Ed25519 signature (base64)
  signedBy?: string;             // Publisher's public key
  published: boolean;            // Visibility flag
  downloadCount: number;         // Aggregate downloads
  rating?: number;               // Average user rating (0-5)
}
```

**Example Artifact:**
```json
{
  "id": "01arv6e0f6k0t1yd6qs3y0z2j",
  "name": "nexus-auth",
  "type": "plugin",
  "version": "2.1.0",
  "namespace": "org.acme.security",
  "metadata": {
    "description": "Authentication plugin with OAuth2 support",
    "author": "acme-team",
    "license": "MIT",
    "tags": ["auth", "oauth2", "security"],
    "repository": "https://github.com/acme/nexus-auth"
  },
  "contentHash": "sha256:abc123...",
  "dependencies": {
    "org.hyper.core": "^2.0.0",
    "org.acme.crypto": "^1.5.0"
  },
  "published": true,
  "downloadCount": 15234,
  "rating": 4.8
}
```

### Namespace

Organizational structure for grouping related artifacts.

**Schema:**
```typescript
interface Namespace {
  id: string;                    // UUIDv7
  path: string;                  // Hierarchical path (e.g., 'org.team')
  scope: 'global' | 'system' | 'library' | 'organization' | 'user' | 'local';
  owner?: string;                // User/org identifier
  public: boolean;               // Public discoverability
  maxArtifacts?: number;         // Storage limit
  storageQuota?: number;         // Size quota in bytes
  storageUsed: number;           // Current usage in bytes
  visibility: 'public' | 'private' | 'internal';
}
```

**Example Namespaces:**
```json
[
  {
    "id": "01arv6e0f6k0t1yd6qs3y0z2a",
    "path": "org.acme",
    "scope": "organization",
    "owner": "acme-corp",
    "public": true,
    "visibility": "public",
    "storageQuota": 5368709120,
    "storageUsed": 1073741824
  },
  {
    "id": "01arv6e0f6k0t1yd6qs3y0z2b",
    "path": "user.alice",
    "scope": "user",
    "owner": "alice@example.com",
    "public": false,
    "visibility": "private",
    "storageQuota": 1073741824,
    "storageUsed": 268435456
  }
]
```

### Manifest Types

Extended artifact types with additional metadata and content.

**PluginManifest:**
```typescript
interface PluginManifest extends Artifact {
  type: 'plugin';
  content: {
    entryPoint: string;          // Main export (e.g., 'dist/index.js')
    capabilities: string[];      // Supported operations
    requiredPermissions: string[]; // RBAC capabilities needed
    configSchema?: object;       // JSON Schema for configuration
    hooks?: Record<string, string>; // Lifecycle hooks
  };
}
```

**ServiceManifest:**
```typescript
interface ServiceManifest extends Artifact {
  type: 'service';
  content: {
    endpoint: string;            // Service URL or gRPC path
    protocol: 'grpc' | 'rest' | 'graphql' | 'websocket';
    healthCheck: string;         // Health endpoint path
    apiVersion: string;          // Service API version
    methods: Record<string, {
      description: string;
      requestSchema?: object;
      responseSchema?: object;
    }>;
  };
}
```

**ConfigManifest:**
```typescript
interface ConfigManifest extends Artifact {
  type: 'config';
  content: {
    configSchema: object;        // JSON Schema (required)
    defaultValues?: Record<string, unknown>;
    environment?: Record<string, string>; // Environment variable mappings
    encryption?: boolean;        // Should values be encrypted?
  };
}
```

---

## Namespace Hierarchy

### Scope Rules

| Scope | Path Pattern | Owner | Public | Max Artifacts | Notes |
|-------|------|-------|--------|---|---|
| **global** | `pkg.name` | System | Yes | Unlimited | Public registry artifacts |
| **system** | `hyper.*` | System | Yes | Unlimited | Built-in system artifacts |
| **library** | `lib.name` | Community | Yes | 1000 | Shared libraries |
| **organization** | `org.name` | Organization | Configurable | 5000 | Enterprise namespaces |
| **user** | `user.email` | User | No | 100 | Personal artifacts |
| **local** | `local.*` | Local system | No | Unlimited | Development-only |

### Path Validation

```typescript
// Valid paths
'org.acme'
'org.acme.team'
'org.acme.team.project'
'user.alice@example.com'
'lib.commons'
'hyper.core'
'pkg.react'

// Invalid paths
'org.acme..' // Double dots
'org.ACME' // Uppercase (case-insensitive enforced)
'-org.acme' // Leading dash
'org.acme-' // Trailing dash
```

### Namespace Hierarchy Rules

1. **Parent-child relationships**: `org.acme.team` is a child of `org.acme`
2. **Path inheritance**: Child namespaces inherit some parent settings
3. **Conflict resolution**: Longer paths take precedence in lookups
4. **Storage quotas**: Can be set at any level; child quotas cannot exceed parent

---

## Versioning Strategy

### Semantic Versioning (SemVer)

All artifacts use SemVer format: `MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]`

**Examples:**
```
1.0.0           // Release version
2.1.0-beta.1    // Beta prerelease
1.5.2-rc.3      // Release candidate
3.0.0-alpha     // Alpha version
2.0.0+build.123 // Build metadata
```

### Compatibility Rules

| Constraint | Meaning | Example |
|-----------|---------|---------|
| `^1.2.3` | Same major, compatible minor/patch | Matches 1.2.3, 1.5.0, 1.9.9 |
| `~1.2.3` | Same major.minor | Matches 1.2.3, 1.2.9 |
| `1.2.x` | Exact major.minor | Matches 1.2.0, 1.2.5 |
| `>=1.2.0` | Greater than or equal | Matches 1.2.0, 2.0.0, 3.0.0 |
| `1.2.3` | Exact version only | Matches 1.2.3 only |

### Deprecation Policy

```typescript
interface DeprecationPolicy {
  deprecatedAt: Date;            // When deprecated
  removedAt?: Date;              // When it will be removed
  replacement?: string;          // Suggested alternative artifact
  reason: string;                // Deprecation reason
  alternateVersions?: string[];  // Other viable versions
}
```

---

## Operations Reference

### 25 Operation Types

The registry supports 25 distinct operation types across CRUD, discovery, lifecycle, and administration:

#### CRUD Operations (5)

| Operation | Description | Input | Output | Audit |
|-----------|-------------|-------|--------|-------|
| **create** | Create new artifact | CreateArtifactRequest | Artifact | ✅ |
| **read** | Get artifact by ID | artifact_id | Artifact | ✅ |
| **update** | Modify artifact | UpdateArtifactRequest | Artifact | ✅ |
| **delete** | Remove artifact | artifact_id | DeleteArtifactResponse | ✅ |
| **list** | List artifacts in namespace | ListArtifactsRequest | Artifact[] | ✅ |

#### Discovery Operations (4)

| Operation | Description | Input | Output | Audit |
|-----------|-------------|-------|--------|-------|
| **search** | Full-text search | SearchRequest | Artifact[] | ✅ |
| **query** | Advanced query with filters | QueryRequest | Artifact[] | ✅ |
| **resolve** | Find artifact by path + version | namespace, name, version | Artifact | ✅ |
| **dependency_graph** | Build dependency tree | artifact_id | DependencyGraph | ✅ |

#### Lifecycle Operations (6)

| Operation | Description | Input | Output | Audit |
|-----------|-------------|-------|--------|-------|
| **publish** | Make artifact public/discoverable | artifact_id | PublishArtifactResponse | ✅ |
| **unpublish** | Hide from public discovery | artifact_id | UnpublishArtifactResponse | ✅ |
| **deprecate** | Mark as deprecated | artifact_id, reason, replacement | DeprecateArtifactResponse | ✅ |
| **undeprecate** | Reverse deprecation | artifact_id | UndeprecateArtifactResponse | ✅ |
| **archive** | Move to archive (soft-delete) | artifact_id | ArchiveArtifactResponse | ✅ |
| **restore** | Restore from archive | artifact_id | RestoreArtifactResponse | ✅ |

#### Validation & Analysis (3)

| Operation | Description | Input | Output | Audit |
|-----------|-------------|-------|--------|-------|
| **validate** | Check artifact integrity | artifact_id or content | ValidationResult | ✅ |
| **test** | Run artifact tests | artifact_id, test_config | TestResult | ✅ |
| **lint** | Check code quality/compliance | artifact_id | LintResult | ✅ |

#### Relationship Operations (3)

| Operation | Description | Input | Output | Audit |
|-----------|-------------|-------|--------|-------|
| **dependency_resolve** | Resolve all transitive dependencies | artifact_id | Artifact[] | ✅ |
| **conflict_detect** | Find version conflicts | namespace | ConflictReport | ✅ |
| **relationship_find** | Find artifacts related by dependency | artifact_id, direction | Artifact[] | ✅ |

#### Admin Operations (4)

| Operation | Description | Input | Output | Audit |
|-----------|-------------|-------|--------|-------|
| **migrate** | Migrate namespace or data | MigrateRequest | MigrateResponse | ✅ |
| **upgrade** | Upgrade artifact schema/format | artifact_id, target_version | UpgradeResponse | ✅ |
| **downgrade** | Revert to previous version | artifact_id, target_version | DowngradeResponse | ✅ |
| **index_rebuild** | Rebuild Meilisearch indexes | namespace? | IndexRebuildResponse | ✅ |
| **cache_clear** | Clear application cache | cache_key? | CacheClearResponse | ✅ |

---

## Persistence Schema

### SQLite Database Schema

```sql
CREATE TABLE artifacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('plugin', 'service', 'config', 'template', 'library', 'theme')),
  version TEXT NOT NULL,
  namespace TEXT NOT NULL,
  metadata JSON NOT NULL,
  content_hash TEXT NOT NULL,
  dependencies JSON,
  signature TEXT,
  signed_by TEXT,
  published BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  rating REAL CHECK(rating >= 0 AND rating <= 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(namespace, name, version)
);

CREATE TABLE namespaces (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  scope TEXT NOT NULL CHECK(scope IN ('global', 'system', 'library', 'organization', 'user', 'local')),
  owner TEXT,
  public BOOLEAN DEFAULT FALSE,
  max_artifacts INTEGER,
  storage_quota INTEGER,
  storage_used INTEGER DEFAULT 0,
  visibility TEXT DEFAULT 'public' CHECK(visibility IN ('public', 'private', 'internal')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE manifests (
  id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  manifest_type TEXT NOT NULL CHECK(manifest_type IN ('plugin', 'service', 'config', 'template')),
  manifest_data JSON NOT NULL,
  content TEXT,
  content_format TEXT,
  content_size INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
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

CREATE TABLE operation_stats (
  operation_type TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  avg_duration_ms REAL DEFAULT 0,
  min_duration_ms INTEGER,
  max_duration_ms INTEGER,
  success_rate REAL DEFAULT 1.0,
  last_executed DATETIME
);
```

### Indexes

```sql
-- Artifact indexes
CREATE INDEX idx_artifacts_namespace ON artifacts(namespace);
CREATE INDEX idx_artifacts_type ON artifacts(type);
CREATE INDEX idx_artifacts_name ON artifacts(name);
CREATE INDEX idx_artifacts_published ON artifacts(published);

-- Namespace indexes
CREATE INDEX idx_namespaces_path ON namespaces(path);
CREATE INDEX idx_namespaces_scope ON namespaces(scope);
CREATE INDEX idx_namespaces_owner ON namespaces(owner);

-- Manifest indexes
CREATE INDEX idx_manifests_artifact ON manifests(artifact_id);
CREATE INDEX idx_manifests_type ON manifests(manifest_type);

-- Audit indexes
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_actor ON audit_logs(actor);
CREATE INDEX idx_audit_operation ON audit_logs(operation);
```

---

## Search & Discovery

### Meilisearch Configuration

```json
{
  "indexes": {
    "artifacts": {
      "primaryKey": "id",
      "searchableAttributes": [
        "name",
        "namespace",
        "metadata.description",
        "metadata.tags",
        "metadata.keywords"
      ],
      "filterableAttributes": [
        "type",
        "namespace",
        "published",
        "metadata.author",
        "metadata.license"
      ],
      "sortableAttributes": [
        "rating",
        "downloadCount",
        "created_at"
      ],
      "faceting": {
        "maxValuesPerFacet": 100
      }
    }
  }
}
```

### Search Query Examples

```graphql
# Simple text search
GET /artifacts/search?q=react

# With filters
GET /artifacts/search?q=auth&filters=type:plugin,published:true

# With faceting
GET /artifacts/search?q=&facets=type,namespace,metadata.author

# Advanced filtering
GET /artifacts/search?q=&filters=((type=plugin OR type=library) AND published=true)

# Sorting
GET /artifacts/search?q=&sort=rating:desc,downloadCount:desc
```

---

## Authentication & Authorization

### RBAC (Role-Based Access Control)

**Roles:**

| Role | Capabilities | Scope |
|------|---|---|
| **Admin** | All operations | Global |
| **Publisher** | Create, publish, manage own artifacts | Namespace |
| **Maintainer** | Update, deprecate, archive | Namespace |
| **Contributor** | Create, submit for review | Namespace |
| **User** | Read, download, search | Public artifacts |

### Permission Matrix

```
                    | Admin | Publisher | Maintainer | Contributor | User |
--------------------|-------|-----------|-----------|------------|------|
create              | ✅    | ✅        | ✅        | ✅         | ❌   |
publish             | ✅    | ✅        | ❌        | ❌         | ❌   |
update              | ✅    | ✅        | ✅        | ❌         | ❌   |
deprecate           | ✅    | ✅        | ✅        | ❌         | ❌   |
delete              | ✅    | ✅        | ❌        | ❌         | ❌   |
read (public)       | ✅    | ✅        | ✅        | ✅         | ✅   |
read (private)      | ✅    | Owner     | Owner      | Owner      | ❌   |
manage_namespace    | ✅    | ❌        | ❌        | ❌         | ❌   |
manage_users        | ✅    | ❌        | ❌        | ❌         | ❌   |
```

### Capability-Based Security

Each operation includes required capabilities:

```typescript
const operationCapabilities = {
  create: ['artifact:create'],
  publish: ['artifact:publish', 'namespace:write'],
  delete: ['artifact:delete'],
  deprecate: ['artifact:deprecate'],
  validate: ['artifact:read'],
  search: ['artifact:discover'],
};
```

---

## gRPC Services

### RegistryService (9 RPC endpoints)

```protobuf
service RegistryService {
  rpc CreateArtifact(CreateArtifactRequest) returns (CreateArtifactResponse);
  rpc GetArtifact(GetArtifactRequest) returns (GetArtifactResponse);
  rpc UpdateArtifact(UpdateArtifactRequest) returns (UpdateArtifactResponse);
  rpc DeleteArtifact(DeleteArtifactRequest) returns (DeleteArtifactResponse);
  rpc ListArtifacts(ListArtifactsRequest) returns (ListArtifactsResponse);
  rpc PublishArtifact(PublishArtifactRequest) returns (PublishArtifactResponse);
  rpc DeprecateArtifact(DeprecateArtifactRequest) returns (DeprecateArtifactResponse);
  rpc ResolveDependencies(ResolveDependenciesRequest) returns (ResolveDependenciesResponse);
  rpc DetectConflicts(DetectConflictsRequest) returns (DetectConflictsResponse);
}
```

### PluginService (6 RPC endpoints)

```protobuf
service PluginService {
  rpc InstallPlugin(InstallPluginRequest) returns (InstallPluginResponse);
  rpc UninstallPlugin(UninstallPluginRequest) returns (UninstallPluginResponse);
  rpc ActivatePlugin(ActivatePluginRequest) returns (ActivatePluginResponse);
  rpc DeactivatePlugin(DeactivatePluginRequest) returns (DeactivatePluginResponse);
  rpc ListPlugins(ListPluginsRequest) returns (ListPluginsResponse);
  rpc GetPluginCapabilities(GetPluginCapabilitiesRequest) returns (GetPluginCapabilitiesResponse);
}
```

### MeshService (4 RPC endpoints)

```protobuf
service MeshService {
  rpc RegisterService(RegisterServiceRequest) returns (RegisterServiceResponse);
  rpc DeregisterService(DeregisterServiceRequest) returns (DeregisterServiceResponse);
  rpc DiscoverServices(DiscoverServicesRequest) returns (DiscoverServicesResponse);
  rpc GetServiceMetrics(GetServiceMetricsRequest) returns (GetServiceMetricsResponse);
}
```

---

## Plugin System

### Plugin Lifecycle

```
uninstalled
    ↓
 install → installed
    ↓
activate → active
    ↓
deactivate → inactive
    ↓
  uninstall
    ↓
uninstalled
```

### Plugin Manifest

```typescript
interface PluginCapabilities {
  transformArtifact?: boolean;
  validateArtifact?: boolean;
  customSearchFacets?: string[];
  webhookSupport?: boolean;
  metricsExport?: boolean;
}

interface PluginManifest {
  id: string;
  name: string;
  version: string;
  entryPoint: string;
  capabilities: PluginCapabilities;
  requiredPermissions: string[];
  configSchema: JSONSchema;
  hooks: {
    onArtifactCreate?: string;
    onArtifactPublish?: string;
    onSearch?: string;
  };
}
```

---

## Microservices Mesh

### Service Registration

```typescript
interface ServiceRegistration {
  id: string;
  name: string;
  namespace: string;
  endpoint: string;
  protocol: 'grpc' | 'rest' | 'graphql';
  healthCheckUrl: string;
  version: string;
  capabilities: string[];
  metadata?: Record<string, string>;
}
```

### Service Discovery

```
1. Client requests DiscoverServices(namespace, capability)
2. Registry queries service registry
3. Filters by namespace and required capability
4. Returns list of healthy service endpoints
5. Client connects to optimal endpoint (load balancing)
```

### Health Checks

```typescript
interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: Date;
  uptime: number; // percentage
  responseTime: number; // ms
}
```

---

## Summary Table

| Component | Type | Count | Status |
|-----------|------|-------|--------|
| **Artifact Types** | Enumeration | 6 | ✅ |
| **Namespace Scopes** | Enumeration | 6 | ✅ |
| **Operation Types** | Enumeration | 25 | ✅ |
| **SQL Tables** | Database | 5 | ✅ |
| **gRPC Services** | Service | 3 | ✅ |
| **RPC Endpoints** | Procedure | 19 | ✅ |
| **Permission Roles** | Authorization | 5 | ✅ |

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready
Excellent. Proceeding with implementation as confirmed.

Based on our analysis and the real-world context from the search results—which highlight TypeScript's strengths for development speed and ecosystem, and Go's performance for specific CPU-bound tasks—the choice of TypeScript/Node.js is validated for this registry's initial iteration.

Here is the concrete starting point for the **Advanced Dynamic Universal Hyper Registry (Phase 1)**.

### 🗂️ Project Structure & First Steps

Begin by creating the monorepo root and foundational packages. This structure isolates concerns and allows for incremental development.

```
hyper-registry/
├── package.json                       # Root workspace config (using pnpm)
├── tsconfig.base.json                 # Shared TypeScript configuration
├── biome.json                         # Code formatting & linting (Biome)
├── .gitignore
├── README.md
│
├── packages/
│   ├── core/                          # Registry Engine
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts               # Main export
│   │   │   ├── models/                # TypeScript interfaces & types
│   │   │   │   ├── artifact.ts
│   │   │   │   ├── namespace.ts
│   │   │   │   └── index.ts
│   │   │   ├── storage/               # Persistence layer
│   │   │   │   ├── sqlite.ts
│   │   │   │   ├── search-index.ts    # Meilisearch client
│   │   │   │   └── migrations/        # SQL migration files
│   │   │   ├── validation/            # Schema validation (Zod)
│   │   │   └── crypto/                # Signatures & verification
│   │   └── tests/
│   │
│   ├── cli/                           # Command-Line Interface
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts               # CLI entry point
│   │   │   ├── commands/              # Individual commands
│   │   │   │   ├── registry/
│   │   │   │   │   ├── create.ts
│   │   │   │   │   ├── read.ts
│   │   │   │   │   └── list.ts
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   └── bin/                       # Linked executable
│   │       └── hyper
│   │
│   ├── tui/                           # Terminal UI (Scaffold)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── engine.tsx             # Ink + Blessed setup
│   │       ├── layouts/
│   │       │   └── dashboard.tsx      # Single-panel v1 layout
│   │       └── themes/
│   │           └── default.ts
│   │
│   └── proto/                         # gRPC Protocol Definitions
│       ├── package.json
│       ├── registry.proto             # Core registry service
│       └── buf.gen.yaml               # Configuration for buf/ts-proto
│
├── tools/
│   └── codegen/                       # Scripts for proto -> TS
│
└── docs/
    └── SPECIFICATIONS.md              # Your comprehensive spec
```

### ✅ Immediate Action Items (Day 1)

Here are the first concrete files to create:

1.  **Root Configuration** (`hyper-registry/package.json`):
    ```json
    {
      "name": "hyper-registry",
      "private": true,
      "scripts": {
        "build": "pnpm -r run build",
        "test": "pnpm -r run test",
        "dev": "pnpm -r run dev --parallel"
      },
      "devDependencies": {
        "@biomejs/biome": "latest",
        "typescript": "^5.0.0"
      }
    }
    ```

2.  **Core Data Model** (`packages/core/src/models/artifact.ts`):
    ```typescript
    // Initial TypeScript interface for the primary entity
    export interface Artifact {
      id: string; // UUIDv7
      name: string;
      type: 'plugin' | 'service' | 'config' | 'template';
      version: string; // semver
      namespace: string; // e.g., 'orgs/acme/projects/api'
      metadata: {
        description?: string;
        tags: string[];
        author: string;
        licenses: string[];
        created: Date;
        updated: Date;
      };
      // To be expanded with signatures, dependencies, content hash
    }
    ```

3.  **First CLI Command** (`packages/cli/src/commands/registry/create.ts`):
    ```typescript
    import { Command } from 'commander';
    import { initRegistry } from '@hyper-registry/core';

    export const createCommand = new Command('create')
      .description('Create a new artifact in the registry')
      .argument('<type>', 'Artifact type (plugin|service|config|template)')
      .argument('<name>', 'Artifact name')
      .option('--namespace <path>', 'Namespace path', 'users/default')
      .action(async (type, name, options) => {
        const registry = await initRegistry();
        console.log(`Creating ${type} '${name}' in ${options.namespace}...`);
        // Core integration point will go here
      });
    ```

### 🛠️ Technology Stack to Install Now

Run these commands from your project root to set up the confirmed stack:

```bash
# Initialize monorepo and install core tools
pnpm init
pnpm add -Dw typescript @biomejs/biome

# Create packages and install dependencies
pnpm -F core add better-sqlite3 meilisearch zod
pnpm -F cli add commander inquirer @hyper-registry/core
pnpm -F tui add ink blessed react
pnpm -F proto add @bufbuild/protoc-gen-es @bufbuild/protobuf

# Install dev dependencies for building
pnpm -F core -F cli -F tui add -Dw @types/node esbuild vitest
```
 # Advanced Dynamic Universal Hyper Registry (ADUHR) - Technical Specifications

## 1. Project Vision & Core Principles

### 1.1 Vision Statement
Create a universal, extensible registry system that serves as the single source of truth for all digital artifacts—plugins, services, configurations, and templates—within an organization or ecosystem. The system prioritizes developer experience, security, and scalability while maintaining simplicity at its core.

### 1.2 Core Principles
1. **Local-First**: Operate fully offline with automatic synchronization capabilities
2. **Extensible by Design**: Everything is a plugin, including core functionality
3. **Security by Default**: All artifacts are signed, all actions are capability-controlled
4. **Type-Safe Everything**: From API boundaries to plugin interfaces
5. **Progressive Enhancement**: Start simple, scale as needed

## 2. Data Model & Schema

### 2.1 Core Artifact Types

#### 2.1.1 Base Artifact Interface
```typescript
interface BaseArtifact {
  // Identity & Metadata
  id: string;                    // UUIDv7 (time-ordered)
  name: string;                  // kebab-case identifier
  type: ArtifactType;           // plugin|service|config|template
  version: string;              // Semantic version (semver.org)
  namespace: string;            // Hierarchical namespace path
  
  // Content & Storage
  contentHash: string;          // SHA3-512 of content
  contentUri?: string;          // Reference to blob storage
  contentSize: number;          // Size in bytes
  
  // Security
  signatures: ArtifactSignature[];
  publisher: PublisherInfo;
  
  // Lifecycle
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  
  // Status
  visibility: 'public' | 'private' | 'internal';
  state: 'draft' | 'published' | 'deprecated' | 'archived';
  
  // Metadata
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface ArtifactSignature {
  algorithm: 'ed25519' | 'ecdsa-p256' | 'rsa-pss';
  publicKey: string;           // Base64-encoded
  signature: string;           // Base64-encoded
  timestamp: Date;
  chain?: string[];            // Optional certificate chain
}

interface PublisherInfo {
  id: string;
  name: string;
  email?: string;
  url?: string;
}
```

#### 2.1.2 Plugin Artifact
```typescript
interface PluginArtifact extends BaseArtifact {
  type: 'plugin';
  
  // Runtime Requirements
  runtime: {
    language: 'typescript' | 'python' | 'rust' | 'go' | 'wasm';
    version: string;
    engine?: string;           // e.g., 'node@20', 'deno@1.35'
  };
  
  // Capabilities & Permissions
  capabilities: PluginCapability[];
  permissions: Permission[];
  
  // Plugin Metadata
  entryPoint: string;          // Main entry file/function
  hooks: HookDefinition[];     // Lifecycle hooks
  commands?: CommandDefinition[]; // CLI commands exposed
  
  // Dependencies
  dependencies: Dependency[];
  peerDependencies?: Dependency[];
  
  // Configuration
  configSchema?: JSONSchema;   // Configuration schema
  defaultConfig?: Record<string, any>;
}

interface PluginCapability {
  name: string;
  version: string;
  description: string;
}

interface HookDefinition {
  name: string;
  event: string;               // e.g., 'registry:beforeCreate'
  handler: string;             // Function name
  priority: number;            // 0-1000, lower = earlier
}
```

#### 2.1.3 Service Artifact
```typescript
interface ServiceArtifact extends BaseArtifact {
  type: 'service';
  
  // Deployment Configuration
  deployment: {
    type: 'container' | 'wasm' | 'process' | 'serverless';
    image?: string;            // OCI image reference
    entrypoint?: string;
    command?: string[];
    
    // Resource Requirements
    resources: {
      cpu: string;            // e.g., '100m', '1'
      memory: string;         // e.g., '128Mi', '1Gi'
      storage?: string;
      gpu?: boolean;
    };
    
    // Environment
    env: Record<string, string>;
    ports: ServicePort[];
    
    // Health Checks
    livenessProbe?: HealthCheck;
    readinessProbe?: HealthCheck;
  };
  
  // Service Mesh Integration
  mesh: {
    sidecar: boolean;
    injectionPoints: string[];
    trafficPolicy: TrafficPolicy;
    resilience: ResiliencePolicy;
  };
  
  // API Definition
  api?: {
    protocol: 'http' | 'grpc' | 'graphql' | 'websocket';
    endpoints: EndpointDefinition[];
    openapi?: string;         // OpenAPI spec
  };
  
  // Scaling
  scaling: {
    minReplicas: number;
    maxReplicas: number;
    metrics: ScalingMetric[];
  };
}

interface ServicePort {
  name: string;
  port: number;
  protocol: 'tcp' | 'udp' | 'http' | 'grpc';
  expose: boolean;
}
```

#### 2.1.4 Configuration Artifact
```typescript
interface ConfigArtifact extends BaseArtifact {
  type: 'config';
  
  // Configuration Structure
  format: 'json' | 'yaml' | 'toml' | 'hcl' | 'env';
  schema?: JSONSchema;        // Validation schema
  encrypted: boolean;
  
  // Inheritance & Composition
  extends?: string[];         // Config IDs to inherit from
  overrides?: Record<string, any>;
  
  // Targeting
  target: {
    scope: 'global' | 'namespace' | 'artifact' | 'user';
    selector?: Selector;      // Which artifacts/users this applies to
  };
  
  // Sensitive Data
  sensitiveFields?: string[]; // Fields to mask in logs
  secrets?: SecretReference[];
}

interface SecretReference {
  name: string;
  source: 'vault' | 'aws-secrets' | 'gcp-secret' | 'builtin';
  path: string;
}
```

#### 2.1.5 Template Artifact
```typescript
interface TemplateArtifact extends BaseArtifact {
  type: 'template';
  
  // Template Engine
  engine: 'handlebars' | 'jinja2' | 'eta' | 'ejs';
  
  // Input Parameters
  parameters: TemplateParameter[];
  
  // Output Specification
  outputs: TemplateOutput[];
  
  // Dependencies
  dependencies: Dependency[];
  
  // Hooks
  preGenerate?: string[];     // Commands to run before generation
  postGenerate?: string[];    // Commands to run after generation
}

interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
  required: boolean;
  default?: any;
  validation?: {
    regex?: string;
    enum?: any[];
    min?: number;
    max?: number;
  };
}

interface TemplateOutput {
  name: string;
  type: 'file' | 'directory' | 'artifact';
  path: string;               // Template for path generation
  permissions?: string;       // Unix permissions (e.g., '0644')
}
```

### 2.2 Versioning Strategy

#### 2.2.1 Version Components
```
Format: <major>.<minor>.<patch>[-<pre-release>][+<build>]

Examples:
- Stable: 1.2.3
- Pre-release: 2.0.0-beta.1
- Build metadata: 1.0.0+20240101.abc123
```

#### 2.2.2 Version Tags & Channels
```typescript
interface VersionInfo {
  version: string;
  tags: string[];
  channels: string[];
  created: Date;
  yanked: boolean;
  yankedReason?: string;
}

// Standard Tags
const STANDARD_TAGS = {
  LATEST: 'latest',          // Most recent stable
  STABLE: 'stable',          // Latest passing all tests
  BETA: 'beta',              // Feature complete, testing
  ALPHA: 'alpha',            // Early access
  CANARY: 'canary',          // A/B testing
  DEPRECATED: 'deprecated',  // Not recommended
  ARCHIVED: 'archived',      // Read-only
} as const;

// Release Channels
const RELEASE_CHANNELS = {
  STABLE: 'stable',
  EDGE: 'edge',
  NIGHTLY: 'nightly',
  CUSTOM: 'custom',          // User-defined channels
} as const;
```

#### 2.2.3 Version Constraints
```typescript
type VersionConstraint = 
  | string                    // Exact: "1.2.3"
  | { eq: string }           // Equal: { eq: "1.2.3" }
  | { gt: string }           // Greater than: { gt: "1.0.0" }
  | { gte: string }          // Greater than or equal
  | { lt: string }           // Less than
  | { lte: string }          // Less than or equal
  | { range: string }        // Range: { range: "^1.2.3" }
  | { caret: string }        // Caret: { caret: "^1.2.3" }
  | { tilde: string }        // Tilde: { tilde: "~1.2.3" }
  | { wildcard: string };    // Wildcard: { wildcard: "1.2.*" }
```

### 2.3 Namespace System

#### 2.3.1 Hierarchical Namespace Structure
```
Namespace Format: <scope>/<owner>/<project>/<environment>?/<component>?

Full Examples:
- global/system/registry/core
- orgs/acme/production/services/api-gateway
- users/john/private/plugins/custom-formatter
- local/cache/temp/build-artifacts
```

#### 2.3.2 Namespace Metadata
```typescript
interface Namespace {
  path: string;
  name: string;
  parent?: string;
  
  // Metadata
  description?: string;
  labels: Record<string, string>;
  
  // Policies
  policies: NamespacePolicy[];
  
  // Quotas & Limits
  quotas: {
    storage: number;          // Max bytes
    artifacts: number;        // Max artifact count
    bandwidth: number;        // Bytes/month
    apiCalls: number;         // Calls/month
  };
  
  // Access Control
  acl: AccessControlEntry[];
  
  // Lifecycle
  created: Date;
  updated: Date;
}

interface NamespacePolicy {
  type: 'validation' | 'security' | 'quality' | 'compliance';
  name: string;
  config: Record<string, any>;
  enforcement: 'advisory' | 'mandatory';
}
```

#### 2.3.3 Namespace Inheritance Rules
1. **Policy Inheritance**: Policies inherit downward unless overridden
2. **Quota Inheritance**: Child namespaces share parent's quota pool
3. **Permission Inheritance**: Permissions are additive (union of all parent permissions)
4. **Label Inheritance**: Labels merge, child values override parent values

### 2.4 Dependency Management

#### 2.4.1 Dependency Specification
```typescript
interface Dependency {
  // Target Artifact
  artifact: string;           // Artifact ID or pattern
  version: VersionConstraint;
  type?: 'runtime' | 'dev' | 'build' | 'peer';
  
  // Resolution Hints
  registry?: string;          // Specific registry to use
  scope?: string;            // e.g., 'production', 'development'
  
  // Conditional Dependencies
  condition?: DependencyCondition;
  
  // Metadata
  reason?: string;           // Why this dependency exists
  optional?: boolean;
}

interface DependencyCondition {
  os?: string[];             // e.g., ['linux', 'darwin']
  arch?: string[];           // e.g., ['x64', 'arm64']
  env?: Record<string, string>; // Environment variable checks
  feature?: string[];        // Feature flags required
}
```

#### 2.4.2 Dependency Resolution Algorithm
```typescript
interface ResolutionResult {
  resolved: Map<string, ResolvedDependency>;
  conflicts: DependencyConflict[];
  warnings: ResolutionWarning[];
  lockfile?: Lockfile;
}

interface ResolvedDependency {
  artifact: Artifact;
  version: string;
  dependencies: ResolvedDependency[]; // Transitive deps
  depth: number;
  selectedBy?: string;       // Which dep caused this selection
}

// Resolution Steps:
// 1. Flatten all dependencies (direct + transitive)
// 2. Group by artifact ID
// 3. For each group, find version satisfying all constraints
// 4. If conflict, use conflict resolution strategy
// 5. Build dependency tree
// 6. Validate no circular dependencies
// 7. Generate lockfile
```

#### 2.4.3 Conflict Resolution Strategies
1. **Highest Version**: Choose highest compatible version
2. **Lowest Version**: Choose lowest compatible version  
3. **Newest Published**: Choose most recently published
4. **Most Downloaded**: Choose most popular version
5. **Manual Resolution**: Require user intervention

## 3. API Specification

### 3.1 gRPC Service Definition

#### 3.1.1 Core Registry Service
```protobuf
syntax = "proto3";

package hyper.registry.v1;

import "google/protobuf/timestamp.proto";
import "google/protobuf/struct.proto";

service RegistryService {
  // Artifact Operations
  rpc CreateArtifact(CreateArtifactRequest) returns (Artifact);
  rpc GetArtifact(GetArtifactRequest) returns (Artifact);
  rpc UpdateArtifact(UpdateArtifactRequest) returns (Artifact);
  rpc DeleteArtifact(DeleteArtifactRequest) returns (google.protobuf.Empty);
  rpc ListArtifacts(ListArtifactsRequest) returns (ListArtifactsResponse);
  
  // Search Operations
  rpc SearchArtifacts(SearchArtifactsRequest) returns (SearchArtifactsResponse);
  
  // Namespace Operations
  rpc CreateNamespace(CreateNamespaceRequest) returns (Namespace);
  rpc GetNamespace(GetNamespaceRequest) returns (Namespace);
  rpc ListNamespaces(ListNamespacesRequest) returns (ListNamespacesResponse);
  
  // Dependency Operations
  rpc ResolveDependencies(ResolveDependenciesRequest) returns (ResolveDependenciesResponse);
  rpc GetDependencyTree(GetDependencyTreeRequest) returns (DependencyTree);
  
  // Version Operations
  rpc TagVersion(TagVersionRequest) returns (google.protobuf.Empty);
  rpc ListVersions(ListVersionsRequest) returns (ListVersionsResponse);
  
  // Batch Operations
  rpc BatchGetArtifacts(BatchGetArtifactsRequest) returns (BatchGetArtifactsResponse);
  rpc BatchUpdateArtifacts(BatchUpdateArtifactsRequest) returns (BatchUpdateArtifactsResponse);
  
  // Streaming Operations
  rpc WatchArtifact(WatchArtifactRequest) returns (stream ArtifactEvent);
  rpc WatchNamespace(WatchNamespaceRequest) returns (stream NamespaceEvent);
}

// Request/Response Messages
message CreateArtifactRequest {
  string namespace = 1;
  string type = 2;
  string name = 3;
  google.protobuf.Struct content = 4;
  map<string, string> labels = 5;
  repeated string tags = 6;
}

message GetArtifactRequest {
  string id = 1;
  string version = 2;  // Optional, latest if not specified
}

message SearchArtifactsRequest {
  string query = 1;
  string namespace = 2;  // Optional, search within namespace
  string type = 3;       // Optional, filter by type
  repeated string tags = 4; // Optional, filter by tags
  int32 page_size = 5;
  string page_token = 6;
}

message SearchArtifactsResponse {
  repeated Artifact artifacts = 1;
  string next_page_token = 2;
  int32 total_size = 3;
}

// Streaming Messages
message ArtifactEvent {
  enum EventType {
    CREATED = 0;
    UPDATED = 1;
    DELETED = 2;
    TAGGED = 3;
  }
  
  EventType type = 1;
  Artifact artifact = 2;
  google.protobuf.Timestamp timestamp = 3;
}
```

#### 3.1.2 Plugin Service
```protobuf
service PluginService {
  // Plugin Management
  rpc InstallPlugin(InstallPluginRequest) returns (PluginInstallation);
  rpc UninstallPlugin(UninstallPluginRequest) returns (google.protobuf.Empty);
  rpc ListPlugins(ListPluginsRequest) returns (ListPluginsResponse);
  rpc GetPlugin(GetPluginRequest) returns (Plugin);
  
  // Plugin Runtime
  rpc ExecutePlugin(ExecutePluginRequest) returns (ExecutePluginResponse);
  rpc CallHook(CallHookRequest) returns (CallHookResponse);
  
  // Plugin Discovery
  rpc SearchPlugins(SearchPluginsRequest) returns (SearchPluginsResponse);
  rpc GetPluginMetadata(GetPluginMetadataRequest) returns (PluginMetadata);
}

message ExecutePluginRequest {
  string plugin_id = 1;
  string command = 2;
  google.protobuf.Struct arguments = 3;
  ExecutionContext context = 4;
}

message ExecutionContext {
  string request_id = 1;
  string user_id = 2;
  string namespace = 3;
  map<string, string> environment = 4;
  google.protobuf.Struct config = 5;
}
```

#### 3.1.3 Mesh Service
```protobuf
service MeshService {
  // Service Management
  rpc DeployService(DeployServiceRequest) returns (ServiceDeployment);
  rpc UndeployService(UndeployServiceRequest) returns (google.protobuf.Empty);
  rpc ListServices(ListServicesRequest) returns (ListServicesResponse);
  
  // Traffic Management
  rpc UpdateTrafficPolicy(UpdateTrafficPolicyRequest) returns (TrafficPolicy);
  rpc GetTrafficPolicy(GetTrafficPolicyRequest) returns (TrafficPolicy);
  
  // Service Discovery
  rpc RegisterService(RegisterServiceRequest) returns (ServiceRegistration);
  rpc DeregisterService(DeregisterServiceRequest) returns (google.protobuf.Empty);
  rpc DiscoverServices(DiscoverServicesRequest) returns (DiscoverServicesResponse);
  
  // Health & Metrics
  rpc GetServiceHealth(GetServiceHealthRequest) returns (ServiceHealth);
  rpc GetServiceMetrics(GetServiceMetricsRequest) returns (ServiceMetrics);
}

message DeployServiceRequest {
  string artifact_id = 1;
  string version = 2;
  string namespace = 3;
  google.protobuf.Struct config = 4;
  map<string, string> labels = 5;
}
```

### 3.2 REST API Gateway

#### 3.2.1 OpenAPI 3.0 Specification Outline
```yaml
openapi: 3.0.3
info:
  title: Hyper Registry API
  version: 1.0.0
  description: Universal registry for digital artifacts

servers:
  - url: https://registry.example.com/api/v1
    description: Production server
  - url: http://localhost:8080/api/v1
    description: Local development

paths:
  /artifacts:
    get:
      summary: List artifacts
      parameters:
        - name: namespace
          in: query
          schema:
            type: string
        - name: type
          in: query
          schema:
            type: string
            enum: [plugin, service, config, template]
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ArtifactList'
    
    post:
      summary: Create artifact
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateArtifactRequest'
      responses:
        '201':
          description: Artifact created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Artifact'

  /artifacts/{id}:
    get:
      summary: Get artifact
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Artifact'
    
    put:
      summary: Update artifact
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateArtifactRequest'
      responses:
        '200':
          description: Artifact updated

components:
  schemas:
    Artifact:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        type:
          type: string
        version:
          type: string
      required: [id, name, type, version]
```

#### 3.2.2 Authentication & Authorization
```yaml
securitySchemes:
  BearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
  
  ApiKeyAuth:
    type: apiKey
    in: header
    name: X-API-Key

security:
  - BearerAuth: []
  - ApiKeyAuth: []
```

### 3.3 CLI Command Structure

#### 3.3.1 Command Hierarchy
```bash
# Core Registry Commands
hyper registry create <type> <name> [options]
hyper registry get <id|name> [options]
hyper registry update <id> [options]
hyper registry delete <id> [options]
hyper registry list [options]
hyper registry search <query> [options]

# Namespace Management
hyper namespace create <path> [options]
hyper namespace get <path> [options]
hyper namespace list [parent-path] [options]
hyper namespace delete <path> [options]
hyper namespace policy <path> [options]

# Version Management
hyper version tag <id> <version> [options]
hyper version list <id> [options]
hyper version promote <id> <version> <channel> [options]
hyper version yank <id> <version> [reason]

# Dependency Management
hyper deps add <id> <dependency> [options]
hyper deps remove <id> <dependency> [options]
hyper deps list <id> [options]
hyper deps resolve <id> [options]
hyper deps tree <id> [options]

# Validation & Security
hyper validate <path|id> [options]
hyper sign <id> --key <path> [options]
hyper verify <id> [options]
hyper audit <namespace> [options]

# Import/Export
hyper export <namespace> [options]
hyper import <file> [options]
hyper sync <source> <target> [options]

# Plugin Management (Phase 3)
hyper plugin install <id|url> [options]
hyper plugin uninstall <id> [options]
hyper plugin list [options]
hyper plugin run <id> <command> [args...]

# Service Management (Phase 4)
hyper service deploy <id> [options]
hyper service undeploy <id> [options]
hyper service list [options]
hyper service logs <id> [options]
hyper service scale <id> <replicas> [options]

# Mesh Operations (Phase 4)
hyper mesh status [options]
hyper mesh proxy [options]
hyper mesh route <service> [options]
hyper mesh policy <service> [options]
```

#### 3.3.2 Command Options Standardization
```typescript
// Common options across all commands
const COMMON_OPTIONS = {
  // Output Format
  '--output': ['json', 'yaml', 'table', 'wide'],
  '--quiet': 'boolean',
  
  // Configuration
  '--config': 'string',
  '--namespace': 'string',
  
  // Authentication
  '--token': 'string',
  '--api-url': 'string',
  
  // Debugging
  '--verbose': 'boolean',
  '--debug': 'boolean',
  '--trace': 'boolean',
  
  // Confirmation
  '--yes': 'boolean',
  '--force': 'boolean',
  
  // Filtering
  '--filter': 'string',
  '--selector': 'string',
  '--label': 'string',
} as const;
```

## 4. Persistence Layer

### 4.1 SQLite Schema Design

#### 4.1.1 Core Tables
```sql
-- Artifacts table
CREATE TABLE artifacts (
  id TEXT PRIMARY KEY,                    -- UUIDv7
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('plugin', 'service', 'config', 'template')),
  version TEXT NOT NULL,
  namespace TEXT NOT NULL,
  
  -- Content
  content_hash TEXT NOT NULL,
  content_uri TEXT,
  content_size INTEGER NOT NULL,
  
  -- Metadata
  metadata_json TEXT NOT NULL,            -- JSON serialized metadata
  labels_json TEXT,                       -- JSON serialized labels
  annotations_json TEXT,                  -- JSON serialized annotations
  
  -- Status
  visibility TEXT NOT NULL DEFAULT 'private',
  state TEXT NOT NULL DEFAULT 'draft',
  
  -- Timestamps
  created_at INTEGER NOT NULL,            -- Unix timestamp
  updated_at INTEGER NOT NULL,
  published_at INTEGER,
  
  -- Indexes
  INDEX idx_artifacts_namespace (namespace),
  INDEX idx_artifacts_type (type),
  INDEX idx_artifacts_created (created_at),
  UNIQUE (namespace, name, version)
);

-- Namespaces table
CREATE TABLE namespaces (
  path TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_path TEXT,
  
  -- Metadata
  description TEXT,
  metadata_json TEXT,
  
  -- Quotas
  quota_storage INTEGER,
  quota_artifacts INTEGER,
  quota_bandwidth INTEGER,
  quota_api_calls INTEGER,
  
  -- Timestamps
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  -- Foreign key
  FOREIGN KEY (parent_path) REFERENCES namespaces(path) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_namespaces_parent (parent_path)
);

-- Dependencies table
CREATE TABLE dependencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artifact_id TEXT NOT NULL,
  dependency_artifact TEXT NOT NULL,
  version_constraint TEXT NOT NULL,
  dependency_type TEXT NOT NULL,
  scope TEXT,
  
  -- Metadata
  optional INTEGER NOT NULL DEFAULT 0,
  reason TEXT,
  
  -- Timestamps
  created_at INTEGER NOT NULL,
  
  -- Foreign keys
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_dependencies_artifact (artifact_id),
  INDEX idx_dependencies_dependency (dependency_artifact)
);

-- Signatures table
CREATE TABLE signatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artifact_id TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  public_key TEXT NOT NULL,
  signature TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  chain_json TEXT,
  
  -- Foreign key
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_signatures_artifact (artifact_id),
  INDEX idx_signatures_public_key (public_key)
);

-- Version tags table
CREATE TABLE version_tags (
  artifact_id TEXT NOT NULL,
  version TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  
  -- Primary key
  PRIMARY KEY (artifact_id, version, tag),
  
  -- Foreign key
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_version_tags_artifact (artifact_id),
  INDEX idx_version_tags_tag (tag)
);
```

#### 4.1.2 Full-Text Search Tables
```sql
-- Search index table
CREATE VIRTUAL TABLE artifacts_fts USING fts5(
  id UNINDEXED,
  name,
  description,
  tags,
  content='artifacts',
  content_rowid='rowid',
  tokenize='porter unicode61'
);

-- Triggers to maintain FTS index
CREATE TRIGGER artifacts_ai AFTER INSERT ON artifacts BEGIN
  INSERT INTO artifacts_fts(rowid, name, description, tags)
  VALUES (new.rowid, new.name, 
          json_extract(new.metadata_json, '$.description'),
          json_extract(new.metadata_json, '$.tags'));
END;

CREATE TRIGGER artifacts_ad AFTER DELETE ON artifacts BEGIN
  INSERT INTO artifacts_fts(artifacts_fts, rowid, name, description, tags)
  VALUES('delete', old.rowid, old.name, 
         json_extract(old.metadata_json, '$.description'),
         json_extract(old.metadata_json, '$.tags'));
END;

CREATE TRIGGER artifacts_au AFTER UPDATE ON artifacts BEGIN
  INSERT INTO artifacts_fts(artifacts_fts, rowid, name, description, tags)
  VALUES('delete', old.rowid, old.name,
         json_extract(old.metadata_json, '$.description'),
         json_extract(old.metadata_json, '$.tags'));
  
  INSERT INTO artifacts_fts(rowid, name, description, tags)
  VALUES (new.rowid, new.name,
          json_extract(new.metadata_json, '$.description'),
          json_extract(new.metadata_json, '$.tags'));
END;
```

#### 4.1.3 Audit Log Table
```sql
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  event_data TEXT NOT NULL,                -- JSON serialized event data
  user_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  resource_type TEXT,
  resource_id TEXT,
  namespace TEXT,
  
  -- Timestamps
  timestamp INTEGER NOT NULL,
  
  -- Indexes
  INDEX idx_audit_log_timestamp (timestamp),
  INDEX idx_audit_log_resource (resource_type, resource_id),
  INDEX idx_audit_log_namespace (namespace),
  INDEX idx_audit_log_user (user_id)
);
```

### 4.2 Storage Strategy

#### 4.2.1 Content Storage Tiers
```typescript
interface StorageStrategy {
  // Tier 1: Inline Storage (small artifacts < 10KB)
  inlineMaxSize: number;
  
  // Tier 2: Filesystem Storage (medium artifacts < 10MB)
  filesystemPath: string;
  filesystemMaxSize: number;
  
  // Tier 3: External Blob Storage (large artifacts)
  blobStorage: {
    provider: 's3' | 'gcs' | 'azure' | 'minio' | 'ipfs';
    bucket: string;
    region?: string;
    endpoint?: string;
    credentials: BlobStorageCredentials;
  };
  
  // Caching Strategy
  caching: {
    enabled: boolean;
    maxSize: number;
    ttl: number; // Time to live in seconds
    strategy: 'lru' | 'lfu' | 'arc';
  };
  
  // Deduplication
  deduplication: {
    enabled: boolean;
    algorithm: 'content_hash' | 'chunked';
    chunkSize?: number;
  };
  
  // Replication
  replication: {
    enabled: boolean;
    factor: number; // Number of replicas
    locations: string[]; // Geographic locations
  };
}

// Content addressing
function getContentAddress(content: Buffer): string {
  const hash = crypto.createHash('sha3-512');
  hash.update(content);
  return `sha3-512:${hash.digest('hex')}`;
}

// Storage location resolution
function resolveStorageLocation(contentSize: number, contentType?: string): StorageLocation {
  if (contentSize < STORAGE_TIERS.inlineMaxSize) {
    return { tier: 'inline', path: null };
  } else if (contentSize < STORAGE_TIERS.filesystemMaxSize) {
    const hash = getContentHash(content);
    const path = `${STORAGE_TIERS.filesystemPath}/${hash.substring(0, 2)}/${hash.substring(2, 4)}/${hash}`;
    return { tier: 'filesystem', path };
  } else {
    const hash = getContentHash(content);
    const key = `${hash.substring(0, 2)}/${hash.substring(2, 4)}/${hash}`;
    return { tier: 'blob', path: key };
  }
}
```

#### 4.2.2 Migration System
```typescript
interface Migration {
  version: number;
  name: string;
  up: (db: Database) => Promise<void>;
  down: (db: Database) => Promise<void>;
  timestamp: Date;
}

class MigrationManager {
  private migrations: Migration[] = [];
  private currentVersion: number = 0;
  
  async migrate(targetVersion?: number): Promise<void> {
    const db = await this.getDatabase();
    
    // Ensure migrations table exists
    await this.ensureMigrationsTable(db);
    
    // Get applied migrations
    const applied = await this.getAppliedMigrations(db);
    const appliedVersions = new Set(applied.map(m => m.version));
    
    // Determine migrations to run
    const toApply = this.migrations
      .filter(m => !appliedVersions.has(m.version))
      .sort((a, b) => a.version - b.version);
    
    // Apply migrations
    for (const migration of toApply) {
      try {
        await db.transaction(async (tx) => {
          await migration.up(tx);
          await this.recordMigration(tx, migration);
        });
        console.log(`Applied migration: ${migration.name} (v${migration.version})`);
      } catch (error) {
        console.error(`Failed to apply migration ${migration.name}:`, error);
        throw error;
      }
    }
  }
  
  async rollback(targetVersion: number): Promise<void> {
    const db = await this.getDatabase();
    const applied = await this.getAppliedMigrations(db);
    
    // Sort descending to rollback from latest
    const toRollback = applied
      .filter(m => m.version > targetVersion)
      .sort((a, b) => b.version - a.version);
    
    for (const migration of toRollback) {
      try {
        await db.transaction(async (tx) => {
          await migration.down(tx);
          await this.removeMigrationRecord(tx, migration.version);
        });
        console.log(`Rolled back migration: ${migration.name} (v${migration.version})`);
      } catch (error) {
        console.error(`Failed to rollback migration ${migration.name}:`, error);
        throw error;
      }
    }
  }
}
```

## 5. Security Model

### 5.1 Authentication & Authorization

#### 5.1.1 Identity Providers
```typescript
interface IdentityProvider {
  type: 'oidc' | 'saml' | 'ldap' | 'local' | 'api-key';
  name: string;
  config: Record<string, any>;
  
  // Authentication methods
  authenticate(credentials: Credentials): Promise<AuthResult>;
  validateToken(token: string): Promise<TokenValidationResult>;
  getUserInfo(userId: string): Promise<UserInfo>;
}

interface AuthResult {
  success: boolean;
  token?: string;
  user?: User;
  expiresIn?: number;
  error?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  groups: string[];
  roles: string[];
  permissions: Permission[];
  metadata: Record<string, any>;
}
```

#### 5.1.2 Capability-Based Access Control
```typescript
interface Capability {
  // Resource being accessed
  resource: {
    type: string;        // 'artifact', 'namespace', 'plugin', etc.
    id?: string;         // Specific resource ID, or '*' for all
    namespace?: string;  // Namespace constraint
  };
  
  // Actions allowed
  actions: string[];     // e.g., ['read', 'write', 'delete', 'execute']
  
  // Conditions
  conditions: Condition[];
  
  // Validity
  expiresAt?: Date;
  notBefore?: Date;
  
  // Delegation
  delegable: boolean;
  maxDelegationDepth?: number;
}

interface Condition {
  type: 'time' | 'ip' | 'user-agent' | 'resource-state' | 'custom';
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';
  value: any;
}

// Capability token format
interface CapabilityToken {
  iss: string;          // Issuer (user/entity ID)
  sub: string;          // Subject (resource)
  aud: string;          // Audience
  cap: Capability;      // The capability being granted
  iat: number;          // Issued at
  exp: number;          // Expiration
  nbf: number;          // Not before
  jti: string;          // Token ID
  sig: string;          // Signature
}

// Capability verification
async function verifyCapability(
  token: CapabilityToken,
  action: string,
  resource: Resource
): Promise<VerificationResult> {
  // 1. Verify signature
  const isValid = await verifySignature(token);
  if (!isValid) {
    return { allowed: false, reason: 'Invalid signature' };
  }
  
  // 2. Check expiration
  if (token.exp && Date.now() >= token.exp * 1000) {
    return { allowed: false, reason: 'Token expired' };
  }
  
  // 3. Check not-before
  if (token.nbf && Date.now() < token.nbf * 1000) {
    return { allowed: false, reason: 'Token not yet valid' };
  }
  
  // 4. Check resource matches
  if (!resourceMatches(token.cap.resource, resource)) {
    return { allowed: false, reason: 'Resource mismatch' };
  }
  
  // 5. Check action is allowed
  if (!token.cap.actions.includes(action) && !token.cap.actions.includes('*')) {
    return { allowed: false, reason: 'Action not allowed' };
  }
  
  // 6. Check conditions
  for (const condition of token.cap.conditions) {
    if (!evaluateCondition(condition, context)) {
      return { allowed: false, reason: 'Condition not met' };
    }
  }
  
  return { allowed: true };
}
```

#### 5.1.3 Role-Based Access Control (RBAC)
```typescript
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  constraints: Constraint[];
  inheritsFrom?: string[];  // Role inheritance
}

interface Permission {
  resource: string;
  action: string;
  effect: 'allow' | 'deny';
  conditions?: Condition[];
}

// RBAC Policy Evaluation
class RBACEngine {
  private roles: Map<string, Role> = new Map();
  private userRoles: Map<string, string[]> = new Map();
  
  async isAllowed(
    userId: string,
    resource: string,
    action: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    // Get user's roles
    const roleIds = this.userRoles.get(userId) || [];
    const roles = roleIds.map(id => this.roles.get(id)).filter(Boolean);
    
    // Collect all permissions from roles (with inheritance)
    const allPermissions = this.collectPermissions(roles);
    
    // Evaluate permissions
    return this.evaluatePermissions(allPermissions, resource, action, context);
  }
  
  private collectPermissions(roles: Role[]): Permission[] {
    const permissions: Permission[] = [];
    const visited = new Set<string>();
    
    function collect(role: Role) {
      if (visited.has(role.id)) return;
      visited.add(role.id);
      
      // Add role's permissions
      permissions.push(...role.permissions);
      
      // Recursively collect inherited roles
      if (role.inheritsFrom) {
        for (const parentId of role.inheritsFrom) {
          const parentRole = this.roles.get(parentId);
          if (parentRole) {
            collect(parentRole);
          }
        }
      }
    }
    
    for (const role of roles) {
      collect(role);
    }
    
    return permissions;
  }
  
  private evaluatePermissions(
    permissions: Permission[],
    resource: string,
    action: string,
    context?: Record<string, any>
  ): boolean {
    let result = false;
    
    // Process permissions in order
    for (const permission of permissions) {
      // Check if permission applies to this resource/action
      if (this.matchesPermission(permission, resource, action)) {
        // Check conditions
        const conditionsMet = this.checkConditions(permission.conditions, context);
        
        if (conditionsMet) {
          if (permission.effect === 'deny') {
            return false; // Explicit deny overrides everything
          } else if (permission.effect === 'allow') {
            result = true; // Allow, but continue checking for denies
          }
        }
      }
    }
    
    return result;
  }
}
```

### 5.2 Cryptography & Signing

#### 5.2.1 Key Management
```typescript
interface KeyPair {
  publicKey: string;    // Base64-encoded
  privateKey: string;   // Base64-encoded (encrypted at rest)
  algorithm: 'ed25519' | 'ecdsa-p256' | 'rsa-4096';
  keyId: string;
  createdAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
}

class KeyManager {
  private keystore: KeyStore;
  private masterKey: CryptoKey;
  
  async generateKeyPair(
    algorithm: KeyAlgorithm,
    metadata?: KeyMetadata
  ): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      algorithm,
      true, // extractable
      ['sign', 'verify']
    );
    
    // Export keys
    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    
    // Encrypt private key
    const encryptedPrivateKey = await this.encryptKey(
      Buffer.from(privateKey),
      this.masterKey
    );
    
    return {
      publicKey: Buffer.from(publicKey).toString('base64'),
      privateKey: encryptedPrivateKey.toString('base64'),
      algorithm: algorithm.name as KeyAlgorithmName,
      keyId: this.generateKeyId(),
      createdAt: new Date(),
      ...metadata
    };
  }
  
  async sign(
    data: Buffer,
    keyId: string,
    options?: SignOptions
  ): Promise<Signature> {
    const keyPair = await this.getKeyPair(keyId);
    
    // Decrypt private key
    const privateKeyBytes = await this.decryptKey(
      Buffer.from(keyPair.privateKey, 'base64'),
      this.masterKey
    );
    
    // Import key
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBytes,
      { name: keyPair.algorithm },
      false,
      ['sign']
    );
    
    // Sign data
    const signature = await crypto.subtle.sign(
      { name: keyPair.algorithm },
      privateKey,
      data
    );
    
    return {
      algorithm: keyPair.algorithm,
      publicKey: keyPair.publicKey,
      signature: Buffer.from(signature).toString('base64'),
      timestamp: new Date(),
      keyId: keyPair.keyId
    };
  }
  
  async verify(
    data: Buffer,
    signature: Signature
  ): Promise<boolean> {
    try {
      const publicKey = await crypto.subtle.importKey(
        'spki',
        Buffer.from(signature.publicKey, 'base64'),
        { name: signature.algorithm },
        false,
        ['verify']
      );
      
      return await crypto.subtle.verify(
        { name: signature.algorithm },
        publicKey,
        Buffer.from(signature.signature, 'base64'),
        data
      );
    } catch (error) {
      return false;
    }
  }
}
```

#### 5.2.2 Artifact Signing Protocol
```typescript
interface ArtifactSigningRequest {
  artifactId: string;
  version: string;
  keyId: string;
  metadata?: Record<string, any>;
}

interface ArtifactSignatureBundle {
  artifactId: string;
  version: string;
  signatures: ArtifactSignature[];
  timestamp: Date;
  chain?: SignatureChain;
}

async function signArtifact(
  artifact: Artifact,
  keyId: string
): Promise<ArtifactSignatureBundle> {
  // Prepare signing payload
  const payload = createSigningPayload(artifact);
  
  // Sign with publisher's key
  const publisherSignature = await keyManager.sign(payload, keyId);
  
  // Optionally get registry attestation
  let registrySignature: ArtifactSignature | undefined;
  if (artifact.visibility === 'public') {
    registrySignature = await registryAttestationService.attest(artifact, publisherSignature);
  }
  
  // Build signature bundle
  const signatures: ArtifactSignature[] = [{
    type: 'publisher',
    ...publisherSignature
  }];
  
  if (registrySignature) {
    signatures.push({
      type: 'registry',
      ...registrySignature
    });
  }
  
  return {
    artifactId: artifact.id,
    version: artifact.version,
    signatures,
    timestamp: new Date()
  };
}

function createSigningPayload(artifact: Artifact): Buffer {
  // Create deterministic JSON for signing
  const signingData = {
    id: artifact.id,
    name: artifact.name,
    type: artifact.type,
    version: artifact.version,
    namespace: artifact.namespace,
    contentHash: artifact.contentHash,
    metadata: canonicalize(artifact.metadata),
    dependencies: canonicalize(artifact.dependencies)
  };
  
  // Canonical JSON (sorted keys, no whitespace)
  const canonicalJson = JSON.stringify(signingData, (key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).sort().reduce((sorted, key) => {
        sorted[key] = value[key];
        return sorted;
      }, {} as any);
    }
    return value;
  });
  
  return Buffer.from(canonicalJson);
}
```

### 5.3 Security Policies & Compliance

#### 5.3.1 Policy Framework
```typescript
interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  rules: SecurityRule[];
  enforcement: 'advisory' | 'mandatory' | 'audit-only';
  scope: PolicyScope;
  exceptions: PolicyException[];
}

interface SecurityRule {
  id: string;
  type: 'validation' | 'inspection' | 'transformation';
  condition: RuleCondition;
  action: RuleAction;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

interface RuleCondition {
  // What to check
  target: 'artifact' | 'namespace' | 'user' | 'operation';
  
  // Field to check
  field: string;
  
  // Operator
  operator: 'equals' | 'contains' | 'matches' | 'in' | 'greater-than' | 'less-than';
  
  // Value to compare against
  value: any;
  
  // Logical operators for complex conditions
  and?: RuleCondition[];
  or?: RuleCondition[];
  not?: RuleCondition;
}

interface RuleAction {
  type: 'allow' | 'deny' | 'modify' | 'log' | 'notify';
  parameters?: Record<string, any>;
}

// Example policies
const SECURITY_POLICIES: SecurityPolicy[] = [
  {
    id: 'no-secrets-in-artifacts',
    name: 'No Secrets in Artifacts',
    description: 'Prevent committing secrets to artifacts',
    enforcement: 'mandatory',
    scope: { type: 'artifact', artifactTypes: ['config', 'template'] },
    rules: [
      {
        id: 'detect-api-keys',
        type: 'inspection',
        condition: {
          target: 'artifact',
          field: 'content',
          operator: 'matches',
          value: /(?:sk|AKIA|ghp)_[a-zA-Z0-9]{20,}/
        },
        action: {
          type: 'deny',
          parameters: { message: 'Potential API key detected in artifact' }
        },
        severity: 'critical'
      }
    ],
    exceptions: []
  },
  {
    id: 'signed-artifacts-only',
    name: 'Signed Artifacts Only',
    description: 'Require all artifacts to be signed',
    enforcement: 'mandatory',
    scope: { type: 'namespace', namespacePattern: 'orgs/*/production' },
    rules: [
      {
        id: 'check-signature',
        type: 'validation',
        condition: {
          target: 'artifact',
          field: 'signatures',
          operator: 'equals',
          value: []
        },
        action: {
          type: 'deny',
          parameters: { message: 'Artifact must be signed' }
        },
        severity: 'high'
      }
    ],
    exceptions: []
  }
];
```

#### 5.3.2 Policy Engine
```typescript
class PolicyEngine {
  private policies: SecurityPolicy[] = [];
  private evaluators: Map<string, PolicyEvaluator> = new Map();
  
  async evaluate(
    context: EvaluationContext,
    resource: Resource
  ): Promise<EvaluationResult> {
    const applicablePolicies = this.getApplicablePolicies(context, resource);
    const results: RuleResult[] = [];
    
    for (const policy of applicablePolicies) {
      const policyResult = await this.evaluatePolicy(policy, context, resource);
      results.push(...policyResult.rules);
      
      // Stop evaluation if mandatory policy fails
      if (policy.enforcement === 'mandatory' && !policyResult.allowed) {
        return {
          allowed: false,
          results,
          violations: policyResult.violations,
          requiresOverride: false
        };
      }
    }
    
    // Check if any critical violations exist
    const criticalViolations = results.filter(
      r => !r.allowed && r.severity === 'critical'
    );
    
    const hasCriticalViolations = criticalViolations.length > 0;
    const hasViolations = results.some(r => !r.allowed);
    
    return {
      allowed: !hasCriticalViolations,
      results,
      violations: results.filter(r => !r.allowed),
      requiresOverride: hasViolations && !hasCriticalViolations
    };
  }
  
  private async evaluatePolicy(
    policy: SecurityPolicy,
    context: EvaluationContext,
    resource: Resource
  ): Promise<PolicyResult> {
    const ruleResults: RuleResult[] = [];
    const violations: RuleResult[] = [];
    
    // Check for exceptions first
    if (this.hasException(policy, context, resource)) {
      return {
        allowed: true,
        rules: [],
        violations: [],
        policyId: policy.id
      };
    }
    
    // Evaluate each rule
    for (const rule of policy.rules) {
      const evaluator = this.evaluators.get(rule.type);
      if (!evaluator) continue;
      
      const result = await evaluator.evaluate(rule, context, resource);
      ruleResults.push(result);
      
      if (!result.allowed) {
        violations.push(result);
      }
    }
    
    // Determine if policy is satisfied
    const allowed = policy.enforcement === 'audit-only' || violations.length === 0;
    
    return {
      allowed,
      rules: ruleResults,
      violations,
      policyId: policy.id
    };
  }
  
  private getApplicablePolicies(
    context: EvaluationContext,
    resource: Resource
  ): SecurityPolicy[] {
    return this.policies.filter(policy => {
      // Check scope
      if (!this.matchesScope(policy.scope, resource, context)) {
        return false;
      }
      
      // Check context (time, user, etc.)
      if (!this.matchesContext(policy, context)) {
        return false;
      }
      
      return true;
    });
  }
}
```

## 6. Discovery & Search

### 6.1 Search Architecture

#### 6.1.1 Indexing Strategy
```typescript
interface SearchIndex {
  // Core fields
  id: string;
  name: string;
  description?: string;
  type: string;
  namespace: string;
  version: string;
  
  // Content fields (for full-text search)
  content?: string;
  tags: string[];
  labels: Record<string, string>;
  
  // Metadata fields
  author?: string;
  license?: string;
  created: Date;
  updated: Date;
  
  // Scoring fields
  popularity: number;        // Download count, usage stats
  quality: number;          // Quality score from reviews/ratings
  relevance: number;        // Contextual relevance score
  
  // Vector embeddings (for semantic search)
  embedding?: number[];
}

class SearchEngine {
  private meilisearch: Meilisearch;
  private sqlite: Database;
  private embedder: EmbeddingModel;
  
  async indexArtifact(artifact: Artifact): Promise<void> {
    // Prepare search document
    const doc: SearchIndex = {
      id: artifact.id,
      name: artifact.name,
      description: artifact.metadata.description,
      type: artifact.type,
      namespace: artifact.namespace,
      version: artifact.version,
      tags: artifact.metadata.tags || [],
      labels: artifact.labels || {},
      author: artifact.metadata.author,
      license: artifact.metadata.license,
      created: artifact.createdAt,
      updated: artifact.updatedAt,
      popularity: await this.calculatePopularity(artifact.id),
      quality: await this.calculateQuality(artifact.id),
      relevance: 1.0 // Default
    };
    
    // Add content for full-text search (if applicable)
    if (artifact.type === 'plugin' || artifact.type === 'config') {
      const content = await this.extractSearchableContent(artifact);
      doc.content = content;
    }
    
    // Generate embedding for semantic search
    if (this.embedder) {
      const text = this.prepareEmbeddingText(artifact);
      doc.embedding = await this.embedder.embed(text);
    }
    
    // Update search index
    await this.meilisearch.index('artifacts').addDocuments([doc]);
    
    // Update SQLite for transactional consistency
    await this.sqlite.run(
      'INSERT OR REPLACE INTO search_index (id, doc) VALUES (?, ?)',
      [artifact.id, JSON.stringify(doc)]
    );
  }
  
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResults> {
    const {
      filters = {},
      sort = ['relevance:desc'],
      page = 1,
      limit = 20,
      vectorSearch = false
    } = options;
    
    // Prepare Meilisearch search parameters
    const searchParams: any = {
      filter: this.buildFilters(filters),
      sort,
      offset: (page - 1) * limit,
      limit,
      attributesToRetrieve: ['*'],
      attributesToCrop: ['content'],
      cropLength: 200
    };
    
    let results: SearchResults;
    
    if (vectorSearch && query.trim()) {
      // Semantic search using vector embeddings
      const queryEmbedding = await this.embedder.embed(query);
      results = await this.meilisearch.index('artifacts').search('', {
        ...searchParams,
        vector: queryEmbedding,
        hybrid: {
          semanticRatio: 0.7,
          embedder: 'default'
        }
      });
    } else {
      // Traditional keyword search
      results = await this.meilisearch.index('artifacts').search(query, searchParams);
    }
    
    // Post-process results
    return this.postProcessResults(results, query, options);
  }
  
  private buildFilters(filters: Record<string, any>): string {
    const filterParts: string[] = [];
    
    if (filters.namespace) {
      filterParts.push(`namespace = "${filters.namespace}"`);
    }
    
    if (filters.type) {
      filterParts.push(`type = "${filters.type}"`);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      const tagFilters = filters.tags.map((tag: string) => `tags = "${tag}"`);
      filterParts.push(`(${tagFilters.join(' OR ')})`);
    }
    
    if (filters.minPopularity !== undefined) {
      filterParts.push(`popularity >= ${filters.minPopularity}`);
    }
    
    if (filters.minQuality !== undefined) {
      filterParts.push(`quality >= ${filters.minQuality}`);
    }
    
    return filterParts.join(' AND ');
  }
}
```

#### 6.1.2 Search Query Language
```typescript
// Search query syntax
type SearchQuery = {
  // Basic keyword search
  q?: string;
  
  // Field-specific searches
  fieldQueries?: Record<string, string>;
  
  // Filters
  filters?: SearchFilter[];
  
  // Facets
  facets?: string[];
  
  // Sorting
  sort?: SortSpec[];
  
  // Pagination
  page?: number;
  pageSize?: number;
  
  // Advanced options
  boost?: BoostSpec[];
  highlight?: HighlightSpec;
  explain?: boolean;
};

// Example queries
const EXAMPLE_QUERIES = {
  // Simple keyword search
  basic: { q: 'authentication plugin' },
  
  // Field-specific search
  fieldSpecific: {
    fieldQueries: {
      name: 'auth*',
      description: 'oauth2 OR openid'
    },
    filters: [{ field: 'type', operator: '=', value: 'plugin' }]
  },
  
  // Advanced filter with facets
  advanced: {
    q: 'database',
    filters: [
      { field: 'type', operator: '=', value: 'service' },
      { field: 'tags', operator: 'includes', value: 'production-ready' },
      { field: 'popularity', operator: '>=', value: 1000 }
    ],
    facets: ['type', 'tags', 'license'],
    sort: [{ field: 'popularity', order: 'desc' }]
  },
  
  // Semantic search
  semantic: {
    q: 'secure user management system',
    vectorSearch: true,
    filters: [{ field: 'type', operator: '=', value: 'plugin' }]
  }
};

// Query parser and builder
class QueryBuilder {
  static fromString(queryString: string): SearchQuery {
    // Parse query string format:
    // name:auth* (description:oauth2 OR openid) type:plugin tags:security,production
    
    const query: SearchQuery = { q: '', filters: [] };
    const tokens = this.tokenize(queryString);
    
    for (const token of tokens) {
      if (token.includes(':')) {
        const [field, value] = token.split(':');
        if (FIELD_OPERATORS.has(field)) {
          query.filters!.push({
            field,
            operator: '=',
            value: value.replace(/^"(.*)"$/, '$1')
          });
        } else {
          if (!query.fieldQueries) query.fieldQueries = {};
          query.fieldQueries[field] = value;
        }
      } else {
        query.q = query.q ? `${query.q} ${token}` : token;
      }
    }
    
    return query;
  }
  
  static toString(query: SearchQuery): string {
    const parts: string[] = [];
    
    if (query.q) {
      parts.push(query.q);
    }
    
    if (query.fieldQueries) {
      for (const [field, value] of Object.entries(query.fieldQueries)) {
        parts.push(`${field}:${this.escapeValue(value)}`);
      }
    }
    
    if (query.filters) {
      for (const filter of query.filters) {
        parts.push(`${filter.field}${filter.operator}${this.escapeValue(filter.value)}`);
      }
    }
    
    return parts.join(' ');
  }
  
  private static escapeValue(value: any): string {
    const str = String(value);
    if (str.includes(' ') || str.includes(':')) {
      return `"${str}"`;
    }
    return str;
  }
}
```

### 6.2 Discovery Mechanisms

#### 6.2.1 Graph-Based Discovery
```typescript
interface DiscoveryGraph {
  nodes: DiscoveryNode[];
  edges: DiscoveryEdge[];
  
  // Graph algorithms
  findSimilar(nodeId: string, limit?: number): DiscoveryNode[];
  findDependents(nodeId: string, depth?: number): DiscoveryNode[];
  findDependencies(nodeId: string, depth?: number): DiscoveryNode[];
  findPath(fromId: string, toId: string): DiscoveryNode[];
  findClusters(minSize?: number): DiscoveryCluster[];
}

interface DiscoveryNode {
  id: string;
  type: 'artifact' | 'namespace' | 'user' | 'tag';
  data: any;
  metrics: NodeMetrics;
  neighbors: string[]; // Connected node IDs
}

interface DiscoveryEdge {
  from: string;
  to: string;
  type: 'depends' | 'used-by' | 'similar' | 'co-occurs' | 'author';
  weight: number;
  metadata?: Record<string, any>;
}

class GraphDiscoveryEngine {
  private graph: DiscoveryGraph;
  private similarityCalculator: SimilarityCalculator;
  
  async discoverRelated(
    artifactId: string,
    options: DiscoveryOptions = {}
  ): Promise<DiscoveryResult> {
    const artifact = await this.getArtifact(artifactId);
    const results: DiscoveryResult = {
      similar: [],
      dependencies: [],
      dependents: [],
      recommended: [],
      clusters: []
    };
    
    // Find similar artifacts (content-based)
    if (options.includeSimilar) {
      results.similar = await this.findSimilarArtifacts(artifact, options.limit);
    }
    
    // Find dependency relationships
    if (options.includeDependencies) {
      results.dependencies = await this.findDependencies(artifact.id, options.depth);
    }
    
    if (options.includeDependents) {
      results.dependents = await this.findDependents(artifact.id, options.depth);
    }
    
    // Find recommended artifacts (collaborative filtering)
    if (options.includeRecommendations) {
      results.recommended = await this.getRecommendations(artifact.id, options.limit);
    }
    
    // Find clusters/communities
    if (options.includeClusters) {
      results.clusters = await this.findClusters(artifact.id);
    }
    
    return results;
  }
  
  private async findSimilarArtifacts(
    artifact: Artifact,
    limit: number = 10
  ): Promise<SimilarArtifact[]> {
    // Calculate similarity using multiple methods
    const similarityMethods = [
      this.calculateContentSimilarity.bind(this),
      this.calculateMetadataSimilarity.bind(this),
      this.calculateUsageSimilarity.bind(this),
      this.calculateDependencySimilarity.bind(this)
    ];
    
    const allSimilarities: Map<string, number> = new Map();
    
    for (const method of similarityMethods) {
      const similarities = await method(artifact);
      for (const [id, score] of similarities) {
        const current = allSimilarities.get(id) || 0;
        allSimilarities.set(id, current + score * method.weight);
      }
    }
    
    // Sort by combined similarity score
    const sorted = Array.from(allSimilarities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
    
    // Fetch artifact details
    const similarArtifacts = await Promise.all(
      sorted.map(async ([id, score]) => {
        const similar = await this.getArtifact(id);
        return {
          artifact: similar,
          similarity: score,
          reasons: await this.getSimilarityReasons(artifact, similar)
        };
      })
    );
    
    return similarArtifacts;
  }
  
  private async calculateContentSimilarity(
    artifact: Artifact
  ): Promise<Map<string, number>> {
    // For plugins/services: compare code structure, APIs
    // For configs/templates: compare schema, structure
    
    const similarities = new Map<string, number>();
    
    switch (artifact.type) {
      case 'plugin':
        // Compare plugin capabilities, entry points, dependencies
        const plugin = artifact as PluginArtifact;
        const allPlugins = await this.getArtifactsByType('plugin');
        
        for (const other of allPlugins) {
          if (other.id === artifact.id) continue;
          
          const otherPlugin = other as PluginArtifact;
          let score = 0;
          
          // Compare capabilities
          const capabilityOverlap = this.jaccardSimilarity(
            plugin.capabilities.map(c => c.name),
            otherPlugin.capabilities.map(c => c.name)
          );
          score += capabilityOverlap * 0.4;
          
          // Compare dependencies
          const dependencyOverlap = this.jaccardSimilarity(
            plugin.dependencies.map(d => d.artifact),
            otherPlugin.dependencies.map(d => d.artifact)
          );
          score += dependencyOverlap * 0.3;
          
          // Compare entry points/APIs
          const apiSimilarity = await this.compareAPIs(plugin, otherPlugin);
          score += apiSimilarity * 0.3;
          
          similarities.set(other.id, score);
        }
        break;
        
      case 'service':
        // Compare deployment specs, APIs, resource requirements
        break;
        
      case 'config':
        // Compare schema structure, field names, patterns
        break;
        
      case 'template':
        // Compare template parameters, output structure
        break;
    }
    
    return similarities;
  }
  
  private jaccardSimilarity(setA: string[], setB: string[]): number {
    const intersection = new Set(setA.filter(x => setB.includes(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  }
}
```

#### 6.2.2 Recommendation Engine
```typescript
interface RecommendationEngine {
  // Recommendation methods
  collaborativeFiltering(userId: string, limit: number): Promise<Artifact[]>;
  contentBasedFiltering(artifact: Artifact, limit: number): Promise<Artifact[]>;
  hybridRecommendation(context: RecommendationContext): Promise<Artifact[]>;
  
  // Training & evaluation
  train(data: TrainingData): Promise<void>;
  evaluate(testData: TestData): Promise<EvaluationMetrics>;
  update(model: RecommendationModel): Promise<void>;
}

class HybridRecommendationEngine implements RecommendationEngine {
  private models: {
    collaborative: CollaborativeFilteringModel;
    content: ContentBasedModel;
    knowledge: KnowledgeBasedModel;
  };
  
  private weights: {
    collaborative: number;
    content: number;
    knowledge: number;
    context: number;
  };
  
  async hybridRecommendation(
    context: RecommendationContext
  ): Promise<Artifact[]> {
    // Get recommendations from each model
    const [collabRecs, contentRecs, knowledgeRecs] = await Promise.all([
      this.models.collaborative.recommend(context),
      this.models.content.recommend(context),
      this.models.knowledge.recommend(context)
    ]);
    
    // Score and merge recommendations
    const scoredRecs = new Map<string, RecommendationScore>();
    
    // Score collaborative recommendations
    for (const rec of collabRecs) {
      const score = rec.score * this.weights.collaborative;
      this.addRecommendation(scoredRecs, rec.artifact, score, 'collaborative');
    }
    
    // Score content-based recommendations
    for (const rec of contentRecs) {
      const score = rec.score * this.weights.content;
      this.addRecommendation(scoredRecs, rec.artifact, score, 'content');
    }
    
    // Score knowledge-based recommendations
    for (const rec of knowledgeRecs) {
      const score = rec.score * this.weights.knowledge;
      this.addRecommendation(scoredRecs, rec.artifact, score, 'knowledge');
    }
    
    // Apply context weighting
    this.applyContextWeights(scoredRecs, context);
    
    // Sort by final score
    const sorted = Array.from(scoredRecs.entries())
      .sort((a, b) => b[1].totalScore - a[1].totalScore)
      .slice(0, context.limit || 20);
    
    // Fetch artifact details
    const artifacts = await this.getArtifacts(sorted.map(([id]) => id));
    
    // Combine with scores
    return artifacts.map((artifact, index) => ({
      artifact,
      score: sorted[index][1].totalScore,
      breakdown: sorted[index][1].breakdown,
      reasons: this.generateRecommendationReasons(artifact, sorted[index][1])
    }));
  }
  
  private addRecommendation(
    map: Map<string, RecommendationScore>,
    artifact: Artifact,
    score: number,
    source: RecommendationSource
  ): void {
    const existing = map.get(artifact.id) || {
      totalScore: 0,
      breakdown: { collaborative: 0, content: 0, knowledge: 0, context: 0 }
    };
    
    existing.breakdown[source] = score;
    existing.totalScore = Object.values(existing.breakdown).reduce((a, b) => a + b, 0);
    
    map.set(artifact.id, existing);
  }
  
  private applyContextWeights(
    recommendations: Map<string, RecommendationScore>,
    context: RecommendationContext
  ): void {
    const contextWeight = this.weights.context;
    
    for (const [artifactId, score] of recommendations) {
      const artifact = this.getCachedArtifact(artifactId);
      if (!artifact) continue;
      
      // Calculate context similarity
      const contextScore = this.calculateContextSimilarity(artifact, context);
      
      // Apply weighting
      score.breakdown.context = contextScore * contextWeight;
      score.totalScore = Object.values(score.breakdown).reduce((a, b) => a + b, 0);
    }
  }
  
  private calculateContextSimilarity(
    artifact: Artifact,
    context: RecommendationContext
  ): number {
    let score = 0;
    
    // Match namespace
    if (context.namespace && artifact.namespace.startsWith(context.namespace)) {
      score += 0.3;
    }
    
    // Match artifact type
    if (context.preferredTypes?.includes(artifact.type)) {
      score += 0.2;
    }
    
    // Match tags
    if (context.tags && artifact.metadata.tags) {
      const tagOverlap = this.jaccardSimilarity(
        context.tags,
        artifact.metadata.tags
      );
      score += tagOverlap * 0.3;
    }
    
    // Match popularity/quality thresholds
    if (context.minPopularity && artifact.metrics.popularity >= context.minPopularity) {
      score += 0.1;
    }
    
    if (context.minQuality && artifact.metrics.quality >= context.minQuality) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  }
}
```

## 7. Implementation Phases & Roadmap

### 7.1 Phase 1: Registry Core (Weeks 1-2)

#### 7.1.1 Deliverables
```yaml
Week 1:
  - [x] Project setup & monorepo structure
  - [x] Core data models (TypeScript interfaces)
  - [x] SQLite schema & migrations
  - [x] Basic CRUD operations (create, read, update, delete)
  - [x] Namespace management
  - [ ] Basic validation & signing skeleton

Week 2:
  - [ ] Version management system
  - [ ] Dependency resolution engine
  - [ ] Basic search with SQLite FTS
  - [ ] CLI with 5 core commands
  - [ ] Simple TUI dashboard (1 layout)
  - [ ] Unit test framework & basic tests
```

#### 7.1.2 Technical Tasks
1. **Database Layer**
   - Implement SQLite connection pooling
   - Create migration system
   - Implement connection retry logic
   - Add database backup/restore

2. **Core Engine**
   - Implement artifact validation
   - Create namespace hierarchy management
   - Build version locking mechanism
   - Implement basic dependency resolution

3. **API Layer**
   - Set up gRPC server with Unix socket
   - Implement error handling middleware
   - Add request validation
   - Implement rate limiting

4. **CLI**
   - Set up commander.js structure
   - Implement config file management
   - Add shell completion
   - Create output formatting (JSON, YAML, table)

### 7.2 Phase 2: Enhanced Features (Weeks 3-4)

#### 7.2.1 Deliverables
```yaml
Week 3:
  - [ ] Meilisearch integration
  - [ ] Advanced search queries
  - [ ] Graph-based discovery
  - [ ] Recommendation engine
  - [ ] Advanced CLI commands

Week 4:
  - [ ] Security model implementation
  - [ ] Capability-based access control
  - [ ] Artifact signing & verification
  - [ ] Audit logging system
  - [ ] Performance optimizations
```

#### 7.2.2 Technical Tasks
1. **Search Enhancement**
   - Integrate Meilisearch
   - Implement faceted search
   - Add search query parser
   - Build search index synchronization

2. **Discovery System**
   - Implement graph database (Neo4j or in-memory)
   - Build similarity algorithms
   - Create recommendation engine
   - Implement usage tracking

3. **Security Implementation**
   - Implement Ed25519 signing
   - Build capability token system
   - Create policy engine
   - Add audit trail

### 7.3 Phase 3: Plugin Ecosystem (Weeks 5-6)

#### 7.3.1 Deliverables
```yaml
Week 5:
  - [ ] Plugin interface & contracts
  - [ ] Plugin loader & sandbox
  - [ ] Plugin lifecycle management
  - [ ] Plugin dependency resolution
  - [ ] Basic plugin examples

Week 6:
  - [ ] Plugin marketplace
  - [ ] Plugin versioning & updates
  - [ ] Plugin security sandboxing
  - [ ] Plugin testing framework
  - [ ] Plugin documentation generator
```

#### 7.3.2 Technical Tasks
1. **Plugin Runtime**
   - Implement WASM sandbox
   - Create plugin isolation boundaries
   - Build plugin communication system
   - Implement plugin health checks

2. **Plugin Management**
   - Create plugin registry
   - Implement plugin installation/updates
   - Build plugin dependency resolution
   - Create plugin configuration system

3. **Plugin Development**
   - Build plugin SDK
   - Create plugin template generator
   - Implement plugin testing framework
   - Build plugin documentation system

### 7.4 Phase 4: Service Mesh (Weeks 7-8)

#### 7.4.1 Deliverables
```yaml
Week 7:
  - [ ] Service definition & deployment
  - [ ] Service discovery system
  - [ ] Load balancing & routing
  - [ ] Health checking & monitoring
  - [ ] Basic mesh controls

Week 8:
  - [ ] Advanced traffic management
  - [ ] Security policies (mTLS, auth)
  - [ ] Observability (metrics, tracing, logs)
  - [ ] Auto-scaling system
  - [ ] Mesh CLI commands
```

#### 7.4.2 Technical Tasks
1. **Mesh Core**
   - Implement service registry
   - Build health checking system
   - Create load balancing algorithms
   - Implement circuit breaking

2. **Traffic Management**
   - Build routing rules engine
   - Implement traffic splitting
   - Create retry & timeout policies
   - Build fault injection system

3. **Observability**
   - Integrate metrics collection
   - Implement distributed tracing
   - Build log aggregation
   - Create dashboard visualizations

### 7.5 Phase 5: Advanced Features & Polish (Weeks 9-10)

#### 7.5.1 Deliverables
```yaml
Week 9:
  - [ ] Generative scoring integration
  - [ ] AI-powered recommendations
  - [ ] Predictive analytics
  - [ ] Automated optimizations
  - [ ] Advanced TUI layouts

Week 10:
  - [ ] Performance benchmarking
  - [ ] Scalability testing
  - [ ] Security audit
  - [ ] Documentation completion
  - [ ] Production deployment guide
```

#### 7.5.2 Technical Tasks
1. **AI Integration**
   - Implement generative scoring
   - Build AI recommendation system
   - Create predictive analytics
   - Implement automated optimizations

2. **Performance & Scale**
   - Conduct load testing
   - Optimize database queries
   - Implement caching layers
   - Build horizontal scaling

3. **Production Readiness**
   - Security audit & penetration testing
   - Performance benchmarking
   - Documentation generation
   - Deployment automation

## 8. Performance & Scaling

### 8.1 Performance Targets
```yaml
Latency Targets:
  - Registry operations (CRUD): < 100ms P95
  - Search queries: < 200ms P95
  - Dependency resolution: < 500ms P95
  - Plugin execution: < 50ms P95
  - Service discovery: < 10ms P95

Throughput Targets:
  - Write operations: 1,000 ops/sec
  - Read operations: 10,000 ops/sec
  - Search queries: 5,000 qps
  - Plugin executions: 2,000 ops/sec

Scale Targets:
  - Artifacts: 10,000,000
  - Namespaces: 100,000
  - Plugins: 50,000
  - Services: 20,000
  - Concurrent users: 10,000
```

### 8.2 Scaling Strategies
```typescript
interface ScalingStrategy {
  // Vertical scaling
  vertical: {
    database: {
      connectionPool: number;
      cacheSize: number;
      writeAheadLog: boolean;
    };
    application: {
      heapSize: string;
      gcOptimization: GCOptions;
      threadPool: ThreadPoolConfig;
    };
  };
  
  // Horizontal scaling
  horizontal: {
    database: {
      readReplicas: number;
      sharding: ShardingStrategy;
      partitioning: PartitioningStrategy;
    };
    application: {
      replicas: number;
      loadBalancer: LoadBalancerConfig;
      serviceDiscovery: ServiceDiscoveryConfig;
    };
  };
  
  // Caching strategy
  caching: {
    levels: CacheLevel[];
    invalidation: CacheInvalidationStrategy;
    ttl: TimeToLiveConfig;
  };
  
  // Optimization
  optimization: {
    query: QueryOptimizationConfig;
    indexing: IndexingStrategy;
    compression: CompressionConfig;
  };
}

// Database sharding strategy
const SHARDING_STRATEGY: ShardingStrategy = {
  method: 'consistent-hashing',
  shardKey: 'namespace', // Shard by namespace for locality
  shards: 256, // Virtual shards
  replicationFactor: 3,
  
  // Shard placement
  placement: {
    algorithm: 'rendezvous-hashing',
    weightByCapacity: true,
    minimizeMovement: true
  }
};

// Cache hierarchy
const CACHE_HIERARCHY: CacheLevel[] = [
  {
    level: 'L1',
    type: 'in-memory',
    size: '512MB',
    ttl: '60s',
    store: 'lru-cache'
  },
  {
    level: 'L2',
    type: 'in-memory-distributed',
    size: '4GB',
    ttl: '300s',
    store: 'redis-cluster'
  },
  {
    level: 'L3',
    type: 'disk',
    size: '100GB',
    ttl: '3600s',
    store: 'rocksdb'
  }
];
```

## 9. Monitoring & Observability

### 9.1 Metrics Collection
```typescript
interface MetricsConfig {
  // System metrics
  system: {
    cpu: boolean;
    memory: boolean;
    disk: boolean;
    network: boolean;
  };
  
  // Application metrics
  application: {
    requests: RequestMetricsConfig;
    database: DatabaseMetricsConfig;
    cache: CacheMetricsConfig;
    queue: QueueMetricsConfig;
  };
  
  // Business metrics
  business: {
    artifacts: ArtifactMetricsConfig;
    users: UserMetricsConfig;
    plugins: PluginMetricsConfig;
    services: ServiceMetricsConfig;
  };
  
  // Export configuration
  export: {
    targets: ExportTarget[];
    frequency: string;
    format: 'prometheus' | 'statsd' | 'json';
  };
}

// Key performance indicators
const KPIS = {
  // Reliability
  availability: '99.95%',
  errorRate: '< 0.1%',
  latencyP95: '< 100ms',
  
  // Throughput
  rps: '> 1000',
  writeThroughput: '> 500 ops/sec',
  readThroughput: '> 5000 ops/sec',
  
  // Efficiency
  cpuUtilization: '< 70%',
  memoryUtilization: '< 80%',
  storageUtilization: '< 85%',
  
  // Business
  artifactGrowth: 'Monitored',
  userGrowth: 'Monitored',
  pluginAdoption: '> 30%'
};

// Alerting rules
const ALERT_RULES = [
  {
    name: 'High Error Rate',
    condition: 'error_rate > 0.05',
    duration: '5m',
    severity: 'warning'
  },
  {
    name: 'Very High Error Rate',
    condition: 'error_rate > 0.1',
    duration: '2m',
    severity: 'critical'
  },
  {
    name: 'High Latency',
    condition: 'latency_p95 > 200',
    duration: '10m',
    severity: 'warning'
  },
  {
    name: 'System Saturation',
    condition: 'cpu_usage > 90 or memory_usage > 95',
    duration: '5m',
    severity: 'critical'
  }
];
```

### 9.2 Logging Strategy
```typescript
interface LoggingConfig {
  // Log levels
  levels: {
    system: 'info';
    security: 'warn';
    business: 'info';
    debug: 'debug';
  };
  
  // Structured logging
  structure: {
    timestamp: boolean;
    level: boolean;
    message: boolean;
    context: ContextFields;
    metadata: MetadataFields;
  };
  
  // Output targets
  targets: LogTarget[];
  
  // Retention & rotation
  retention: {
    policy: 'time-based' | 'size-based';
    duration: '30d';
    maxSize: '10GB';
    compression: 'gzip';
  };
  
  // Security considerations
  security: {
    maskFields: string[];
    sanitization: SanitizationRules;
    accessControl: AccessControlConfig;
  };
}

// Context fields for structured logging
const CONTEXT_FIELDS = {
  request: ['id', 'method', 'path', 'duration'],
  user: ['id', 'ip', 'userAgent'],
  artifact: ['id', 'type', 'namespace', 'version'],
  namespace: ['path', 'owner'],
  plugin: ['id', 'version', 'command'],
  service: ['id', 'instance', 'endpoint']
};

// Log query language
const LOG_QUERY_EXAMPLES = {
  findErrors: 'level:ERROR AND timestamp:>now-1h',
  securityEvents: 'category:security AND (type:login_failed OR type:access_denied)',
  slowRequests: 'duration:>1000 AND category:request',
  artifactChanges: 'category:artifact AND (operation:CREATE OR operation:UPDATE)',
  pluginExecutions: 'category:plugin AND operation:execute'
};
```

## 10. Deployment & Operations

### 10.1 Deployment Architecture
```yaml
Production Deployment:
  Environment: Kubernetes
  Cluster Size: 3 nodes minimum
  
  Services:
    - Registry API: 3 replicas, auto-scaling
    - Search Index: 2 replicas, persistent storage
    - Database: Primary + 2 read replicas
    - Cache: Redis cluster (3 nodes)
    - Queue: RabbitMQ cluster (3 nodes)
    - Monitoring: Prometheus + Grafana + AlertManager
  
  Storage:
    - Database: SSD persistent volumes
    - Blob Storage: S3-compatible object storage
    - Backups: Automated daily backups to cold storage
  
  Networking:
    - Load Balancer: HAProxy/nginx ingress
    - Service Mesh: Istio/Linkerd (optional)
    - TLS: Automated certificate management
  
  Security:
    - Network Policies: Strict pod-to-pod communication
    - Secrets Management: HashiCorp Vault
    - RBAC: Fine-grained Kubernetes RBAC
    - Audit Logging: All administrative actions
```

### 10.2 Disaster Recovery
```typescript
interface DisasterRecoveryPlan {
  // Recovery objectives
  objectives: {
    rto: '4 hours',      // Recovery Time Objective
    rpo: '15 minutes',   // Recovery Point Objective
    mtd: '24 hours'      // Maximum Tolerable Downtime
  };
  
  // Backup strategy
  backup: {
    frequency: 'hourly',
    retention: '30 days',
    locations: ['primary-region', 'secondary-region'],
    encryption: 'AES-256-GCM',
    verification: 'automated'
  };
  
  // Recovery procedures
  procedures: {
    database: DatabaseRecoveryProcedure;
    storage: StorageRecoveryProcedure;
    configuration: ConfigRecoveryProcedure;
    secrets: SecretsRecoveryProcedure;
  };
  
  // Testing schedule
  testing: {
    frequency: 'quarterly',
    types: ['tabletop', 'simulated', 'full'],
    documentation: 'required'
  };
}

// Database recovery procedure
const DATABASE_RECOVERY: DatabaseRecoveryProcedure = {
  steps: [
    {
      name: 'Identify failure',
      actions: ['Check database health', 'Review metrics', 'Check logs'],
      timeout: '5m'
    },
    {
      name: 'Failover to replica',
      actions: [
        'Promote read replica',
        'Update DNS/load balancer',
        'Verify data consistency'
      ],
      timeout: '15m'
    },
    {
      name: 'Restore from backup',
      actions: [
        'Identify latest clean backup',
        'Restore to new instance',
        'Verify integrity',
        'Sync with current data'
      ],
      timeout: '2h'
    },
    {
      name: 'Cleanup and monitoring',
      actions: [
        'Update documentation',
        'Post-mortem analysis',
        'Implement preventive measures'
      ],
      timeout: '1h'
    }
  ],
  dependencies: ['Storage available', 'Network connectivity', 'Backup accessible'],
  successCriteria: ['Database responsive', 'Data consistent', 'Performance normal']
};
```

