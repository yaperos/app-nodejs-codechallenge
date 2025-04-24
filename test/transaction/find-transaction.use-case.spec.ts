import { Test, TestingModule } from '@nestjs/testing';
import { FindTransactionUseCase } from '../../src/modules/transaction/application/use-cases/find-transaction.use-case';
import { PrismaService } from '../../src/modules/transaction/infrastructure/prisma/prisma.service';
import { RedisService } from '../../src/modules/transaction/infrastructure/redis/redis.service';
import { NotFoundException } from '@nestjs/common';

const mockTransaction = {
  id: 'd33b93cb-6a2e-4218-bf27-fdaa90f1e2de',
  value: 500,
  transactionType: { name: 'Transfer' },
  transactionStatus: { name: 'Pending' },
  createdAt: new Date(),
};

describe('FindTransactionUseCase', () => {
  let useCase: FindTransactionUseCase;
  let prisma: PrismaService;
  let redis: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTransactionUseCase,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(FindTransactionUseCase);
    prisma = module.get(PrismaService);
    redis = module.get(RedisService);
  });

  it('should return transaction from cache if exists', async () => {
    jest.spyOn(redis, 'get').mockResolvedValue(mockTransaction);
    const result = await useCase.execute('123');
    expect(result).toEqual(mockTransaction);
  });

  it('should return transaction from DB and cache it', async () => {
    jest.spyOn(redis, 'get').mockResolvedValue(null);
    (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction);
    const result = await useCase.execute('123');
    expect(result).toEqual(mockTransaction);
    expect(redis.set).toHaveBeenCalledWith('tx:123', mockTransaction);
  });

  it('should throw if transaction not found', async () => {
    jest.spyOn(redis, 'get').mockResolvedValue(null);
    jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(null);
    await expect(useCase.execute('invalid')).rejects.toThrow(NotFoundException);
  });
});
