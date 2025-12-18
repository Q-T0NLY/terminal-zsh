/**
 * Core package - Registry domain models, storage, and cryptography
 * Central export point for all core functionality
 *
 * @module @hyper-registry/core
 * @see docs/SPECIFICATIONS.md
 */

// Models and validation
export * from './models';

// Storage layer
export { SQLiteStorage, type StorageConfig } from './storage';

// Cryptographic operations
export {
  generateKeyPair,
  sign,
  verifySignature,
  signArtifact,
  verifyArtifact,
  getPublicKeyFromPrivate,
  type KeyPair,
} from './crypto';

// Sub-registries system
export * from './sub-registries';
