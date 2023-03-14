import { TransactionDataResponse } from '@core/config/types';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@core/entities';
import { PageOptionsDto } from '@core/types/pagination';
import { Order } from '@core/config/constants';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetOneTransactionParam } from './dto/find-transaction.dto';

export class TransactionsMock {
  static readonly kafkaNameTransaction = 'TRANSACTION_SERVICE';
  static readonly transactionExternalId =
    'e7991681-16bd-4a57-b112-a96796ba4a21';

  send = jest.fn().mockReturnThis();
  subscribe = jest.fn().mockReturnThis();
  subscribeToResponseOf = jest.fn().mockReturnThis();
  createTransaction = jest.fn().mockReturnThis();
  getTransactions = jest.fn().mockReturnThis();
  getTransactionById = jest.fn().mockReturnThis();

  static readonly getOneTransactionParam: GetOneTransactionParam = {
    id: 'e7991681-16bd-4a57-b112-a96796ba4a21',
  };

  static readonly pageOptionsDto: PageOptionsDto = {
    page: 1,
    order: Order.ASC,
    take: 10,
    skip: 0,
  };

  static readonly createTransactionDto: CreateTransactionDto = {
    accountExternalIdDebit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    accountExternalIdCredit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    tranferTypeId: 1,
    value: 100,
  };

  static readonly transactionDataResponse: TransactionDataResponse = {
    transactionExternalId: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    transactionType: new TransactionType(),
    transactionStatus: new TransactionStatus(),
    value: 100,
    createdAt: new Date(),
  };

  static readonly listTransaction: Transaction[] = [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      accountExternalIdDebit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
      accountExternalIdCredit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
      value: 55,
      transactionType: new TransactionType(),
      transactionStatus: new TransactionStatus(),
    },
  ];

  static readonly paginationTransaction: any = {
    data: this.listTransaction,
    meta: null,
  };
}
