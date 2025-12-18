import { generateKeyPairSync, sign, verify } from 'crypto';
import { createPrivateKey, createPublicKey } from 'crypto';

/**
 * Cryptographic operations for artifact signing and verification
 * Uses Ed25519 (EdDSA) for digital signatures
 *
 * @module crypto/ed25519
 * @see docs/SPECIFICATIONS.md#Authentication_and_Authorization
 */

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * Generate a new Ed25519 key pair
 * @returns KeyPair with base64-encoded keys
 */
export function generateKeyPair(): KeyPair {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');

  return {
    publicKey: publicKey.export({ format: 'pem', type: 'spki' }),
    privateKey: privateKey.export({ format: 'pem', type: 'pkcs8' }),
  };
}

/**
 * Sign data with a private key
 * @param data - Buffer to sign
 * @param privateKeyPem - PEM-encoded private key
 * @returns Base64-encoded signature
 * @throws {Error} if signing fails
 */
export function sign(data: Buffer, privateKeyPem: string): string {
  try {
    const privateKey = createPrivateKey({
      key: privateKeyPem,
      format: 'pem',
    });

    const signature = sign(null, data, privateKey);
    return signature.toString('base64');
  } catch (error) {
    throw new Error(`Failed to sign data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify a signature with a public key
 * @param data - Original buffer that was signed
 * @param signatureBase64 - Base64-encoded signature
 * @param publicKeyPem - PEM-encoded public key
 * @returns true if signature is valid, false otherwise
 */
export function verifySignature(
  data: Buffer,
  signatureBase64: string,
  publicKeyPem: string
): boolean {
  try {
    const publicKey = createPublicKey({
      key: publicKeyPem,
      format: 'pem',
    });

    const signature = Buffer.from(signatureBase64, 'base64');
    return verify(null, data, publicKey, signature);
  } catch (error) {
    return false;
  }
}

/**
 * Sign an artifact content hash
 * Convenience function for artifact signing workflow
 * @param contentHash - SHA256 hash of artifact content
 * @param privateKeyPem - Signer's private key
 * @returns Base64-encoded signature
 */
export function signArtifact(contentHash: string, privateKeyPem: string): string {
  const data = Buffer.from(contentHash, 'utf8');
  return sign(data, privateKeyPem);
}

/**
 * Verify an artifact signature
 * Convenience function for artifact verification workflow
 * @param contentHash - SHA256 hash of artifact content
 * @param signature - Base64-encoded signature
 * @param publicKeyPem - Signer's public key
 * @returns true if signature is valid
 */
export function verifyArtifact(contentHash: string, signature: string, publicKeyPem: string): boolean {
  const data = Buffer.from(contentHash, 'utf8');
  return verifySignature(data, signature, publicKeyPem);
}

/**
 * Extract public key from private key
 * Useful for deriving public key for storage/transmission
 * @param privateKeyPem - PEM-encoded private key
 * @returns PEM-encoded public key
 */
export function getPublicKeyFromPrivate(privateKeyPem: string): string {
  const privateKey = createPrivateKey({
    key: privateKeyPem,
    format: 'pem',
  });

  const publicKey = createPublicKey({ key: privateKey });
  return publicKey.export({ format: 'pem', type: 'spki' });
}
