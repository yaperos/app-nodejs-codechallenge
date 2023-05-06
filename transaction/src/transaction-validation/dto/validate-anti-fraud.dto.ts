export class ValidateAntiFraudDto {
  constructor(
    public readonly transactionExternalId: string,
    public readonly value: number,
    public readonly status: number,
  ) {}
}
