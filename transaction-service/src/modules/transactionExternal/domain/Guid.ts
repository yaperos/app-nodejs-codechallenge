import { Entity, Result, UniqueEntityID } from 'clean-common-lib';

export class Guid extends Entity<unknown> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<Guid> {
    return Result.ok<Guid>(new Guid(id));
  }
}
