/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import Transaction from '../../domain/transaction';
import TransactionCommand from '../commands/transaction.command';

@Injectable()
export default class TransactionFactory {
  public createTransaction(
    transactionCommand: TransactionCommand,
  ): Transaction {
    return new Transaction({
      accountExternalIdDebit: transactionCommand.accountExternalIdDebit,
      accountExternalIdCredit: transactionCommand.accountExternalIdCredit,
      tranferTypeId: transactionCommand.tranferTypeId,
      value: transactionCommand.value,
    });
  }
}
