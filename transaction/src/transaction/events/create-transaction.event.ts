import { TransactionRsDto } from "../dto/transaction-rs.dto/transaction-rs.dto";

export class CreateTransactionEvent{

  transaction : TransactionRsDto;

  constructor(transaction: TransactionRsDto) {
    this.transaction = transaction;
  }
}