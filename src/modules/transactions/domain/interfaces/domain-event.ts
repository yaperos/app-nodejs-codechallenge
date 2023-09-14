export interface IDomainEvent {
  dateTimeOccurred: Date;
  getId(): string;
}
