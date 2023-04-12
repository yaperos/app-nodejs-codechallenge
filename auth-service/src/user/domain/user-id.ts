import { ValueObject } from '../../shared/domain/value-object';
import { Result } from '../../shared/core/result';
import { v4 as uuid } from 'uuid';

export interface UserIdProp {
  _id: string;
}

export class UserID extends ValueObject<UserIdProp> {
  get id(): string {
    return this.props._id;
  }

  private constructor(props: UserIdProp) {
    super(props);
  }

  public static create(id?: string): Result<UserID> {
    return Result.ok<UserID>(new UserID({ _id: id || uuid() }));
  }
}
