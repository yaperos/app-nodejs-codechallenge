export class ValidateAntiFraudDto {
  constructor(
    public readonly transactionExternalId: string,
    public readonly value: number,
    public readonly status: number,
  ) {}

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      value: this.value,
      status: this.status,
    });
  }
}
