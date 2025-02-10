const crypto = require('crypto');

function encrypt(text, secretKey) {
  const iv = crypto.randomBytes(12); // Initialization Vector
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(secretKey, 'hex'),
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return iv.toString('hex') + ':' + encrypted + ':' + authTag;
}

function decrypt(encryptedData, secretKey) {
  const [iv, encrypted, authTag] = encryptedData.split(':');

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(secretKey, 'hex'),
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Generate a random 256-bit key (hex format) for testing
const secretKey = crypto.randomBytes(32).toString('hex');

const message = 'hi';
const encrypted = encrypt(message, secretKey);
console.log('Encrypted:', encrypted);

const decrypted = decrypt(encrypted, secretKey);
console.log('Decrypted:', decrypted);

export { encrypt, decrypt };
