import * as crypto from 'crypto';

export class AESHelper {
  constructor(private rawKey: Buffer) {}

  encrypt(clearMessage: string): string {
    const iv: Buffer = crypto.randomBytes(16);
    const cipher: crypto.Cipher = crypto.createCipheriv('aes-128-cbc', this.rawKey, crypto.randomBytes(16));
    const encrypted = Buffer.concat([iv, cipher.update(clearMessage, 'utf-8'), cipher.final()]);
    return encrypted.toString('base64');
  }

  decrypt(cipherMessage: string): string {
    let fullData: Buffer = Buffer.from(cipherMessage, 'base64');
    const iv: Buffer = Buffer.alloc(16);
    const cipherData = Buffer.alloc(fullData.length - 16);

    fullData.copy(iv, 0, 0, 16);
    fullData.copy(cipherData, 0, 16, fullData.length);

    // borramos de memoria el mensaje
    fullData = Buffer.alloc(0);
    const decipher = crypto.createDecipheriv('aes-128-cbc', this.rawKey, iv);
    const message = Buffer.concat([decipher.update(cipherData), decipher.final()]).toString('utf-8');
    return message;
  }
}
