import { TransactionStatusEnum } from './TransactionStatus.enum';

export class AntiFraudResponseDto {
  transactionExternalId: string;
  value: number;
  status: TransactionStatusEnum;


  constructor(transactionExternalId: string, value: number) {
    this.transactionExternalId = transactionExternalId;
    this.value = value;
  }
}
