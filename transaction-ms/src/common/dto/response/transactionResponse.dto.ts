import { TransactionTypeDto } from '../transactionTypeDto.dto';
import { TransactionStatusDto } from '../transactionStatusDto.dto';
[]
export class TransactionResponse {
  transactionExternalId: string;
  transactionType: TransactionTypeDto;
  transactionStatus: TransactionStatusDto;
  value: number;
  createAt: Date;

}