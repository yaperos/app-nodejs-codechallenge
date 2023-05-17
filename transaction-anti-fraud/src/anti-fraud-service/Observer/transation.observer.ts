import { ITransaction, Transaction } from "../entities/transaction.service.entity";

export interface Observer {
    update(transaction: Transaction): void;
  }