import { generateRSAKeys } from '../utils/generateRSAKeys';

describe('RSA Chat Encryption', () => {
  let senderKeys: { publicKey: string; privateKey: string };
  let receiverKeys: { publicKey: string; privateKey: string };

  beforeAll(() => {
    senderKeys = generateRSAKeys();
    receiverKeys = generateRSAKeys();
  });

  test('should generate valid public and private keys', () => {
    expect(senderKeys.publicKey).toBeDefined();
    expect(senderKeys.privateKey).toBeDefined();
    expect(receiverKeys.publicKey).toBeDefined();
    expect(receiverKeys.privateKey).toBeDefined();
  });
});
