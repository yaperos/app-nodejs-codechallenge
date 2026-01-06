import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../transactions/transactions.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';
import { sendTransactionCreated } from '../kafka/transaction.producer';

jest.mock('../kafka/transaction.producer', () => ({
  sendTransactionCreated: jest.fn(),
}));

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

  const prismaMock = {
    transaction: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

    it('should throw error if debit and credit accounts are the same', async () => {
    const dto = {
      accountExternalIdDebit: 'uuid-1',
      accountExternalIdCredit: 'uuid-1',
      tranferTypeId: 1,
      value: 100,
    };

    await expect(service.create(dto as any)).rejects.toThrow(
      BadRequestException,
    );

    expect(prisma.transaction.create).not.toHaveBeenCalled();
  });

    it('should create transaction with pending status', async () => {
    (prisma.transaction.create as jest.Mock).mockResolvedValue({
      transactionExternalId: 'tx-uuid',
      status: 'pending',
    });

    const dto = {
      accountExternalIdDebit: 'uuid-1',
      accountExternalIdCredit: 'uuid-2',
      tranferTypeId: 1,
      value: 100,
    };

    const result = await service.create(dto as any);

    expect(prisma.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'pending',
        }),
      }),
    );

    expect(result.status).toBe('pending');
  });
});