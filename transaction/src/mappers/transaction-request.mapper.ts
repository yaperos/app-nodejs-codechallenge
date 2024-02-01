import { TransferInput } from './../dtos/transaction-request.input';
import {  } from "src/dtos/transaction-request.input";
import { Transaction } from "src/entities/transaction.entity";

export class TransferRequestMapper {
    static mapToTransaction(transferRequest: TransferInput): Transaction {
      const transaction = new Transaction();
      transaction.accountExternalIdDebit = transferRequest.accountExternalIdDebit;
      transaction.accountExternalIdCredit = transferRequest.accountExternalIdCredit;
      transaction.tranferTypeId = transferRequest.tranferTypeId;
      transaction.amount = transferRequest.value; 
      transaction.status = 'pending';
      return transaction;
    }
  }