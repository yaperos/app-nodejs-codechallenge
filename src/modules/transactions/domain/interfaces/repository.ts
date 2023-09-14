import { AggregateRoot } from '../entities/aggregate-root';
import { Identifier } from '../value-objects/identifier';

export interface IRepository {
  nextId(): Identifier;
  persist(aggregateRoot: AggregateRoot): Promise<AggregateRoot>;
}
