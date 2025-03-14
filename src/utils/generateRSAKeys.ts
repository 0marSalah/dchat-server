import { generateKeyPairSync, privateDecrypt, publicEncrypt } from 'crypto';

/**
 * Generate RSA key pairs (public & private keys)
 */
export function generateRSAKeys(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  return { publicKey, privateKey };
}
