export class CreateAntiFraudDto {
  constructor(
    public readonly transactionExternalId: string,
    public readonly value: number,
  ) {}

  ToString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      value: this.value,
    });
  }
}
