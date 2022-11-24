import { TransactionStatusEnum } from './TransactionStatus.enum';

export class AntiFraudResponseDto {
  transactionExternalId: string;
  value: number;
  status: TransactionStatusEnum;
}
