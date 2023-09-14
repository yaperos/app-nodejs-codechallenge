import { v4 as uuidv4 } from 'uuid';
import { Identifier } from '../../domain/value-objects/identifier';

export abstract class BaseRepository {
  public nextId(): Identifier {
    return new Identifier(uuidv4());
  }
}
