import * as bcrypt from 'bcrypt';

export class Crypto {
  public static async encrypt(plainText): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainText, salt);
  }
}
