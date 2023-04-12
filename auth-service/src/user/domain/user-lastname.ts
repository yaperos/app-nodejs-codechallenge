import { Result } from '../../shared/core/result';
import { ValueObject } from '../../shared/domain/value-object';

export interface UserLastnameProps {
  value: string;
}

export class UserLastname extends ValueObject<UserLastnameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserLastnameProps) {
    super(props);
  }

  public static create(value: string): Result<UserLastname> {
    if (!this.isValidLastname(value) || value.length < 2 || value.length > 40) {
      return Result.fail<UserLastname>('Invalid lastname');
    }

    return Result.ok<UserLastname>(new UserLastname({ value }));
  }

  private static isValidLastname(lastname: string): boolean {
    const re = /^[a-zA-Z ]{2,30}$/;
    return re.test(lastname);
  }
}
