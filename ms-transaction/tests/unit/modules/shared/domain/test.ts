import { AuditableAggregateRoot } from 'src/modules/shared/domain/auditable-aggregate-root';

export class Test extends AuditableAggregateRoot {
  public constructor(private id: string, createdAt?: Date, updatedAt?: Date) {
    super(createdAt, updatedAt);
  }

  toPrimitives() {
    return {
      id: this.id,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  getId(): string {
    return this.id;
  }
}
