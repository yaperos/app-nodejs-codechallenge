import { FraudCheckStatus } from '../enums/fraud-check.enums';

export class FraudCheck {
  transactionId: string;
  value: number;
  status: FraudCheckStatus;
  reason?: string;
  processedAt: Date;
}
