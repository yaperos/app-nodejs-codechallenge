import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTransactionUseCase } from '../../src/modules/transaction/application/use-cases/update-transaction.use-case';
import { PrismaService } from '../../src/modules/transaction/infrastructure/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransactionUseCase,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    useCase = module.get(UpdateTransactionUseCase);
    prisma = module.get(PrismaService);
  });

  it('should update the transaction status', async () => {
    const mockTransaction = { id: 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de' };
    const updatedTransaction = { id: 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de', transactionStatusId: 2 };

    jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(mockTransaction as any);
    jest.spyOn(prisma.transaction, 'update').mockResolvedValue(updatedTransaction as any);

    const result = await useCase.execute('d33b93cb-6a2e-4218-bf27-fdaa90f1e2de', 2);
    expect(result).toEqual(updatedTransaction);
  });

  it('should throw NotFoundException if transaction not found', async () => {
    jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(null);
    await expect(useCase.execute('invalid-id', 2)).rejects.toThrow(NotFoundException);
  });
});
