import { ValueObject } from '../../shared/domain/value-object';
import { Result } from '../../shared/core/result';

export interface UserNameProps {
  value: string;
}

export class UserName extends ValueObject<UserNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  public static create(value: string): Result<UserName> {
    if (!this.isValidName(value) || value.length < 2 || value.length > 40) {
      return Result.fail<UserName>('Invalid name');
    }

    return Result.ok<UserName>(new UserName({ value }));
  }

  private static isValidName(name: string): boolean {
    const re = /^[a-zA-Z ]{2,30}$/;
    return re.test(name);
  }
}
