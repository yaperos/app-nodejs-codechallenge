import { FraudCheckStatus } from '../enums/fraud-check.enums';

export class FraudCheckTransaction {
  constructor(
    public readonly transactionExternalId: string,
    public readonly value: number,
    public readonly createdAt: Date = new Date(),
  ) {}

  isFraudulent(): boolean {
    return this.value > 1000;
  }

  getStatus(): FraudCheckStatus {
    return this.isFraudulent()
      ? FraudCheckStatus.REJECTED
      : FraudCheckStatus.APPROVED;
  }
}
