import { TransactionStatusEnum } from "../TransactionStatus.enum";

export class TransactionTypeResponse{

  name: string;

}

export class TransactionStatusResponse{

  name: string;
}

export class TransactionRsDto {

  transactionExternalId: string;
  transactionType: TransactionTypeResponse;
  transactionStatus: TransactionStatusResponse;
  value: number;
  createdAt: Date;
}
