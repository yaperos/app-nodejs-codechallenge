import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from '../../src/modules/transaction/infrastructure/graphql/transaction.resolver';
import { CreateTransactionUseCase } from '../../src/modules/transaction/application/use-cases/create-transaction.use-case';
import { FindTransactionUseCase } from '../../src/modules/transaction/application/use-cases/find-transaction.use-case';
import { TransactionOutput } from '../../src/modules/transaction/infrastructure/graphql/dto/transaction.output';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let createTransaction: CreateTransactionUseCase;
  let findTransaction: FindTransactionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: CreateTransactionUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindTransactionUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    resolver = module.get(TransactionResolver);
    createTransaction = module.get(CreateTransactionUseCase);
    findTransaction = module.get(FindTransactionUseCase);
  });

  it('should create a transaction', async () => {
    const mockInput = {
        accountExternalIdDebit: "f0f1c7fe-83aa-4e5e-a4bb-4cf9fd2f1111",
        accountExternalIdCredit: "aaa0f719-5048-46c6-b8b0-6fa2d13f0088",
        transferTypeId: 1,
        value: 500,
    };

    const mockOutput: TransactionOutput = {
        transactionExternalId: 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de',
        transactionType: { name: 'TRANSFER' },
        transactionStatus: { name: 'pending' },
        value: 500,
        createdAt: new Date(),
    };

    jest.spyOn(createTransaction, 'execute').mockResolvedValue({
        id: 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de',
        transactionType: { name: 'TRANSFER' },
        transactionStatus: { name: 'pending' },
        value: 500,
        createdAt: mockOutput.createdAt,
    } as any);

    const result = await resolver.createTransactionMutation(mockInput);
    expect(result).toEqual(mockOutput);
  });

  it('should find a transaction', async () => {
    const mockId = 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de';
    const mockOutput: TransactionOutput = {
      transactionExternalId: 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de',
      transactionType: { name: 'TRANSFER' },
      transactionStatus: { name: 'approved' },
      value: 100,
      createdAt: new Date(),
    };

    jest.spyOn(findTransaction, 'execute').mockResolvedValue({
      id: 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de',
      transactionType: { name: 'TRANSFER' },
      transactionStatus: { name: 'approved' },
      value: 100,
      createdAt: mockOutput.createdAt,
    } as any);

    const result = await resolver.getTransaction(mockId);
    expect(result).toEqual(mockOutput);
  });
});
