import { Uuid } from '../../../shared/domain/value-object/Uuid';

export class Account {
  readonly id: Uuid;

  constructor(id: Uuid) {
    this.id = id;
  }
}
