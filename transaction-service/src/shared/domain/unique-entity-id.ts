import { Identifier } from './identifier';
import { v4 as uuid } from 'uuid';

export class UniqueEntityID extends Identifier<string> {
  constructor(id?: string) {
    super(id ? id : uuid());
  }
}
