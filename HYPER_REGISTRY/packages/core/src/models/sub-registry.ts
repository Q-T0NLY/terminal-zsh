/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                           HYPER REGISTRY - SUB-REGISTRY MODELS                                                                                            ║
 * ║                    Advanced Sub-Registry Architecture for Multi-Domain Artifacts                                                                          ║
 * ╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
 * ║  FILE: sub-registry.ts                                                                                                                                    ║
 * ║  PURPOSE: Type definitions for specialized sub-registries (Plugin, Service, ML, Data, Infra, Security)                                                    ║
 * ║  MODULE: @hyper-registry/core/models                                                                                                                      ║
 * ║  LAYER: Domain Model                                                                                                                                      ║
 * ╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
 * ║  CREATED: 2024-12-16                                                                                                                                      ║
 * ║  VERSION: 1.0.0                                                                                                                                           ║
 * ║  AUTHOR: NEXUSPRO AI STUDIO                                                                                                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
 */

import { Artifact } from './artifact';

/**
 * Sub-registry types aligned with the Generative Ensemble Fusion architecture
 */
export enum SubRegistryType {
  PLUGIN = 'plugin',      // 🔌 Plugin Registry - WASM/Sandboxed extensions
  SERVICE = 'service',    // 🌐 Service Registry - Mesh-aware microservices
  ML_MODEL = 'ml_model',  // 🧠 ML Model Registry - Version-controlled models
  DATA = 'data',          // 📁 Data Registry - Lineage-tracked datasets
  INFRA = 'infra',        // ⚙️ Infrastructure Registry - IaC templates
  SECURITY = 'security',  // 🛡️ Security Registry - SBOM/Vulnerability DB
}

/**
 * Base interface for sub-registry metadata
 */
export interface SubRegistryMetadata {
  type: SubRegistryType;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  annotations: Record<string, string>;
}

/**
 * 🔌 Plugin Registry Entry
 * WASM/Sandboxed plugins with runtime isolation
 */
export interface PluginRegistryEntry extends Artifact {
  metadata: SubRegistryMetadata & {
    type: SubRegistryType.PLUGIN;
    runtime: 'wasm' | 'javascript' | 'python' | 'native';
    sandbox: 'isolated' | 'shared' | 'none';
    permissions: string[];
    entrypoint: string;
    exports: string[];
  };
  wasmBinary?: Uint8Array;
  sourceCode?: string;
}

/**
 * 🌐 Service Registry Entry
 * Mesh-aware service discovery with health checks
 */
export interface ServiceRegistryEntry extends Artifact {
  metadata: SubRegistryMetadata & {
    type: SubRegistryType.SERVICE;
    endpoints: {
      protocol: 'http' | 'grpc' | 'graphql' | 'websocket';
      host: string;
      port: number;
      path: string;
      healthCheck?: string;
    }[];
    mesh: {
      enabled: boolean;
      sidecar?: 'istio' | 'linkerd' | 'consul';
      mtls: boolean;
    };
    dependencies: string[];
    sla: {
      availability: number;  // e.g., 99.99
      latencyP95: number;    // milliseconds
      latencyP99: number;
    };
  };
}

/**
 * 🧠 ML Model Registry Entry
 * Version-controlled models with lineage and metrics
 */
export interface MLModelRegistryEntry extends Artifact {
  metadata: SubRegistryMetadata & {
    type: SubRegistryType.ML_MODEL;
    framework: 'tensorflow' | 'pytorch' | 'onnx' | 'scikit-learn' | 'huggingface';
    modelType: 'classification' | 'regression' | 'generation' | 'embedding' | 'other';
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
    metrics: {
      accuracy?: number;
      precision?: number;
      recall?: number;
      f1Score?: number;
      loss?: number;
      custom?: Record<string, number>;
    };
    trainingDataset?: string;
    hyperparameters: Record<string, any>;
    lineage: {
      parentModel?: string;
      trainingRuns: string[];
      experiments: string[];
    };
  };
  modelBinary?: Uint8Array;
  checkpointPath?: string;
}

/**
 * 📁 Data Registry Entry
 * Lineage-tracked datasets with versioning
 */
export interface DataRegistryEntry extends Artifact {
  metadata: SubRegistryMetadata & {
    type: SubRegistryType.DATA;
    format: 'parquet' | 'csv' | 'json' | 'avro' | 'arrow' | 'hdf5';
    schema: Record<string, any>;
    statistics: {
      rowCount?: number;
      columnCount?: number;
      fileSize: number;
      checksum: string;
    };
    lineage: {
      sources: string[];
      transformations: {
        operation: string;
        timestamp: Date;
        parameters: Record<string, any>;
      }[];
      consumers: string[];
    };
    quality: {
      completeness?: number;
      accuracy?: number;
      consistency?: number;
      timeliness?: number;
    };
    retention: {
      policy: 'permanent' | 'time-based' | 'event-based';
      duration?: number;  // days
      archiveAfter?: number;  // days
    };
  };
  storageLocation?: string;
}

/**
 * ⚙️ Infrastructure Registry Entry
 * IaC templates and infrastructure definitions
 */
export interface InfraRegistryEntry extends Artifact {
  metadata: SubRegistryMetadata & {
    type: SubRegistryType.INFRA;
    provider: 'aws' | 'gcp' | 'azure' | 'kubernetes' | 'terraform' | 'pulumi';
    templateType: 'cloudformation' | 'terraform' | 'helm' | 'kustomize' | 'arm' | 'pulumi';
    resources: {
      type: string;
      count: number;
      estimated_cost?: number;
    }[];
    dependencies: string[];
    outputs: Record<string, any>;
    validation: {
      syntax: boolean;
      security: boolean;
      compliance: boolean;
      cost: boolean;
    };
  };
  templateContent?: string;
  parametersSchema?: Record<string, any>;
}

/**
 * 🛡️ Security Registry Entry
 * SBOM, vulnerability database, security policies
 */
export interface SecurityRegistryEntry extends Artifact {
  metadata: SubRegistryMetadata & {
    type: SubRegistryType.SECURITY;
    securityType: 'sbom' | 'vulnerability' | 'policy' | 'compliance' | 'certificate';
    severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
    
    // For SBOM
    sbom?: {
      format: 'cyclonedx' | 'spdx';
      components: {
        name: string;
        version: string;
        licenses: string[];
        vulnerabilities: string[];
      }[];
    };
    
    // For vulnerabilities
    vulnerability?: {
      cve: string;
      cvss: number;
      affected: string[];
      patched: boolean;
      remediation?: string;
    };
    
    // For policies
    policy?: {
      type: 'network' | 'rbac' | 'authentication' | 'encryption';
      rules: Record<string, any>;
      enforcement: 'enforcing' | 'permissive' | 'disabled';
    };
    
    // For compliance
    compliance?: {
      framework: 'soc2' | 'hipaa' | 'gdpr' | 'pci-dss' | 'iso27001';
      controls: {
        id: string;
        status: 'compliant' | 'non-compliant' | 'not-applicable';
        evidence?: string;
      }[];
    };
  };
}

/**
 * Union type for all sub-registry entries
 */
export type SubRegistryEntry =
  | PluginRegistryEntry
  | ServiceRegistryEntry
  | MLModelRegistryEntry
  | DataRegistryEntry
  | InfraRegistryEntry
  | SecurityRegistryEntry;

/**
 * Sub-registry configuration
 */
export interface SubRegistryConfig {
  type: SubRegistryType;
  enabled: boolean;
  indexing: {
    enabled: boolean;
    fields: string[];
  };
  validation: {
    strict: boolean;
    customValidators?: ((entry: SubRegistryEntry) => boolean)[];
  };
  storage: {
    backend: 'sqlite' | 'postgres' | 's3' | 'gcs' | 'azure-blob';
    path?: string;
    connectionString?: string;
  };
}

/**
 * Sub-registry query interface
 */
export interface SubRegistryQuery {
  type?: SubRegistryType;
  namespace?: string;
  tags?: string[];
  annotations?: Record<string, string>;
  version?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Sub-registry result set
 */
export interface SubRegistryResult<T extends SubRegistryEntry = SubRegistryEntry> {
  entries: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}
