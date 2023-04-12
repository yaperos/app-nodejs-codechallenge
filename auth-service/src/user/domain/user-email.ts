import { ValueObject } from '../../shared/domain/value-object';
import { Result } from '../../shared/core/result';

export interface userEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<userEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: userEmailProps) {
    super(props);
  }

  public static create(value: string): Result<UserEmail> {
    if (!this.isValidEmail(value)) {
      return Result.fail<UserEmail>('Invalid email');
    }

    return Result.ok<UserEmail>(new UserEmail({ value }));
  }

  private static isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
