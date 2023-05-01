export class CreateAntiFraudDto {
  constructor(
    public readonly transactionExternalId: string,
    public readonly value: number,
  ) {}
}
