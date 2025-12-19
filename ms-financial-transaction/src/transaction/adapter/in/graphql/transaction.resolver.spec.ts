import { GetTransactionsService } from './../../../service/get-transactions.service';
import { CreateTransactionService } from './../../../service/create-transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { Logger } from 'nestjs-pino';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let createTransactionService: jest.Mocked<CreateTransactionService>;
  let getTransactionsService: jest.Mocked<GetTransactionsService>;
  let logger: jest.Mocked<Logger>;

  beforeEach(() => {
    createTransactionService = {} as jest.Mocked<CreateTransactionService>;
    getTransactionsService = {} as jest.Mocked<GetTransactionsService>;
    logger = {} as jest.Mocked<Logger>;
    logger.debug = jest.fn();

    resolver = new TransactionResolver(
      createTransactionService,
      getTransactionsService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
