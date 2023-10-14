import * as bcrypt from 'bcrypt';

export abstract class PasswordEncoder {
  public static encode(password: string | number): string {
    return bcrypt.hashSync(String(password), 10);
  }

  public static compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
