import { TransactionStatus } from "src/common/enums/transaction";

export interface TransactionDto {
  id: string;
  value: number;
  transactionStatus?: TransactionStatus;
}