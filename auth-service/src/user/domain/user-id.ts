import { ValueObject } from '../../shared/domain/value-object';
import { UniqueEntityID } from '../../shared/domain/unique-entity-id';
import { Result } from '../../shared/core/result';

export interface UserIdProp {
  _id: UniqueEntityID;
}

export class userId extends ValueObject<UserIdProp> {
  get id(): UniqueEntityID {
    return this.props._id;
  }

  private constructor(props: UserIdProp) {
    super(props);
  }

  public static create(id: UniqueEntityID): Result<userId> {
    return Result.ok<userId>(new userId({ _id: id }));
  }
}
