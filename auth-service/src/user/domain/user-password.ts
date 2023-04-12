import { ValueObject } from '../../shared/domain/value-object';
import { Result } from '../../shared/core/result';
import bcrypt from 'bcrypt';

export interface userPasswordProps {
  value: string;
}

export class UserPassword extends ValueObject<userPasswordProps> {
  public static minLength = 6;
  public static maxLength = 30;

  private constructor(props: userPasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<UserPassword> {
    if (!this.isValidPassword(value)) {
      return Result.fail<UserPassword>('Invalid password');
    }

    return Result.ok<UserPassword>(new UserPassword({ value }));
  }

  private static isValidPassword(password: string): boolean {
    return (
      password.length >= this.minLength && password.length <= this.maxLength
    );
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public async getHashedPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(this.props.value, 10, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }

  public static isMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
