import * as bcrypt from 'bcrypt';

export class Crypto {
  public static async encrypt(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainText.toString(), salt);
  }

  public static async check(plainText: string, hashText: string) {
    return await bcrypt.compare(plainText.toString(), hashText.toString());
  }
}
