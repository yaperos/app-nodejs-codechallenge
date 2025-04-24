import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from '../../src/modules/transaction/application/use-cases/create-transaction.use-case';
import { PrismaService } from '../../src/modules/transaction/infrastructure/prisma/prisma.service';
import { AntifraudProducer } from '../../src/modules/transaction/infrastructure/kafka/antifraud.producer';
import { CreateTransactionInput } from '../../src/modules/transaction/infrastructure/graphql/dto/create-transaction.input';

const mockTransaction = {
  id: 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de',
  accountExternalIdDebit: 'f0f1c7fe-83aa-4e5e-a4bb-4cf9fd2f1111',
  accountExternalIdCredit: 'aaa0f719-5048-46c6-b8b0-6fa2d13f0088',
  transferTypeId: 1,
  value: 500,
  transactionStatusId: 1,
  createdAt: new Date(),
  transactionType: { name: 'internal' },
  transactionStatus: { name: 'pending' },
};

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let prisma: PrismaService;
  let antifraudProducer: AntifraudProducer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              create: jest.fn().mockResolvedValue(mockTransaction),
            },
          },
        },
        {
          provide: AntifraudProducer,
          useValue: {
            emitTransactionCreated: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    prisma = module.get<PrismaService>(PrismaService);
    antifraudProducer = module.get<AntifraudProducer>(AntifraudProducer);
  });

  it('should create a transaction and emit event', async () => {
    const input: CreateTransactionInput = {
      accountExternalIdDebit: 'f0f1c7fe-83aa-4e5e-a4bb-4cf9fd2f1111',
      accountExternalIdCredit: 'aaa0f719-5048-46c6-b8b0-6fa2d13f0088',
      transferTypeId: 1,
      value: 500,
    };

    const result = await useCase.execute(input);

    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        accountExternalIdDebit: input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        transferTypeId: input.transferTypeId,
        value: input.value,
        transactionStatusId: 1,
      },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });

    expect(antifraudProducer.emitTransactionCreated).toHaveBeenCalledWith(result);
    expect(result).toEqual(mockTransaction);
  });
});
