export class DetectFraudRequest {
  constructor(
    public readonly transactionExternalId: string,
    public readonly value: number,
  ) {}
}
