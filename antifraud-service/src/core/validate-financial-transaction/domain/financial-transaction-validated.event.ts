export class FinancialTransactionValidatedEvent {
  constructor(
    readonly accountExternalIdDebit: string,
    readonly statusTypeId: string,
  ) {}

  toString(): string {
    return JSON.stringify(this);
  }
}
