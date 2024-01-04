import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { CreateTransactionDto } from '../dto/createTransaction.dto';
import { Transaction } from '../entities/transaction.entitie';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let httpService: HttpService;
  const mockCreate = {
    accountExternalIdDebit: 'Guid',
    accountExternalIdCredit: 'Guid',
    tranferTypeId: 1,
    value: 1001,
  };
  const mockResultTransaction = {
    accountExternalIdDebit: 'Guid',
    accountExternalIdCredit: 'Guid',
    tranferTypeId: 1,
    value: 1300,
    id: 'a174016d-50f5-445d-ba57-49a2e94e6f9b',
    transactionStatus: 'pending',
    createdAt: '2024-01-2',
    updatedAt: '2024-01-2',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(httpService).toBeDefined();
  });
  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const mockCreateTransactionDto: CreateTransactionDto = mockCreate;
      const mockTransaction: Transaction = mockResultTransaction;

      httpService.post = jest
        .fn()
        .mockImplementationOnce(() => of({ data: mockTransaction }));

      const result = await resolver.createTransaction(mockCreateTransactionDto);

      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:3001/transaction',
        mockCreateTransactionDto,
      );
      expect(result).toEqual(mockTransaction);
    });
  });
});
