import { ValueObject } from '../../shared/domain/value-object';
import { Result } from '../../shared/core/result';

export enum UserStatusEnum {
  // ACTIVE = Data complete and user can login
  // INACTIVE = Data complete but user cannot login
  // INCOMPLETE = Data incomplete
  ACTIVE,
  INACTIVE,
  INCOMPLETE,
}

export interface UserStatusProps {
  value: UserStatusEnum;
}

export class UserStatus extends ValueObject<UserStatusProps> {
  get value(): UserStatusEnum {
    return this.props.value;
  }

  private constructor(props: UserStatusProps) {
    super(props);
  }

  public static create(value?: string): Result<UserStatus> {
    const defaultStatus = UserStatusEnum[value] || UserStatusEnum.ACTIVE;
    if (!this.isValidStatus(defaultStatus)) {
      return Result.fail<UserStatus>('Invalid status');
    }

    return Result.ok<UserStatus>(new UserStatus({ value: defaultStatus }));
  }

  private static isValidStatus(status: UserStatusEnum): boolean {
    return Object.values(UserStatusEnum).includes(status);
  }
}
