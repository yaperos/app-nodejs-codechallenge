import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TransactionsResolver } from '../transactions/resolvers/transactions.resolver';
import { TransactionsService } from '../transactions/services/transactions.service';
import { AppModule } from '../app.module';
import { config } from '../config';
import { createdTransaction, input, inputGet, transaction, transactions } from './utils/mocks';

describe('TransactionsResolver', () => {
  let resolver: TransactionsResolver;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          load: [config],
        }),
        AppModule
      ]
    }).compile();

    resolver = module.get<TransactionsResolver>(TransactionsResolver);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
  
  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      jest.spyOn(service, 'createTransaction').mockResolvedValue(createdTransaction);
      const result = await resolver.createTransaction(input);
      expect(result).toEqual(createdTransaction);
    });
  });

  describe('transaction', () => {
    it('should return a transaction', async () => {
      jest.spyOn(service, 'getTransactionByID').mockResolvedValue(transaction);
      const result = await resolver.transaction(inputGet);
      expect(result).toEqual(transaction);
    });
  });

  describe('transactions', () => {
    it('should return an array of transactions', async () => {
      jest.spyOn(service, 'getTransactions').mockResolvedValue(transactions);
      const result = await resolver.transactions();
      expect(result).toEqual(transactions);
    });
  });
});
