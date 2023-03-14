import { PageOptionsDto } from '@core/types/pagination';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionStatus, TransactionType } from './entities';

export class TransactionMock {
  static readonly antifraudKafkaConfigName = 'ANTIFRAUD_SERVICE';

  static readonly transactionExternalId =
    'f5555555-21zx-3l21-a666-b12706zf4h10';

  findOneOrFail = jest.fn().mockReturnThis();

  createTransaction = jest.fn().mockReturnThis();

  getAllTransactions = jest.fn().mockReturnThis();

  approvedTransaction = jest.fn().mockReturnThis();

  saveTransactionToCache = jest.fn().mockReturnThis();

  rejectedTransaction = jest.fn().mockReturnThis();

  findAndCount = jest.fn().mockReturnThis();

  findOne = jest.fn().mockReturnThis();

  update = jest.fn().mockReturnThis();

  save = jest.fn().mockReturnThis();

  emit = jest.fn().mockReturnThis();

  static readonly createTransactionDto: CreateTransactionDto = {
    accountExternalIdDebit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    accountExternalIdCredit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    tranferTypeId: 1,
    value: 500,
  };

  static readonly updateTransactionDto: UpdateTransactionDto = {
    transactionExternalId: 'f5555555-21zx-3l21-a666-b12706zf4h10',
    isValid: false,
  };

  static readonly transaction: Transaction = {
    id: 5,
    accountExternalIdDebit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    accountExternalIdCredit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    transactionExternalId: 'f5555555-21zx-3l21-a666-b12706zf4h10',
    value: 555,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionType: new TransactionType(),
    transactionStatus: new TransactionStatus(),
  };

  static readonly listTransactions: Transaction[] = [this.transaction];

  static readonly paginationTransaction: any = {
    data: this.listTransactions,
    meta: null,
  };

  static readonly pageOptionsDto: PageOptionsDto = {
    page: 1,
    take: 10,
    skip: 0,
  };

  static readonly transactionType: TransactionType = {
    id: 1,
    name: 'type 1',
    transactions: [],
  };
}
