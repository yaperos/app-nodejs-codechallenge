import { TransactionStatus } from "src/common/enums/transaction";

export interface AntifraudResponseDto {
  id: string;
  value: number;
  transactionStatus: TransactionStatus;
}