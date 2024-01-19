import { AggregateRoot } from 'src/modules/shared/domain/aggregate-root';

import { AuditableAggregateRootDate } from './auditable-aggregate-root-date';

export abstract class AuditableAggregateRoot extends AggregateRoot {
  private createdAt: AuditableAggregateRootDate;
  private updatedAt: AuditableAggregateRootDate;

  constructor(createdAt?: Date, updatedAt?: Date) {
    super();

    this.createdAt = new AuditableAggregateRootDate(createdAt ?? new Date());
    this.updatedAt = new AuditableAggregateRootDate(
      updatedAt ?? createdAt ?? new Date(),
    );
  }

  public markAsUpdated(): void {
    this.updatedAt = new AuditableAggregateRootDate(new Date());
  }

  public getCreatedAt(): Date {
    return this.createdAt.value;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt.value;
  }
}
