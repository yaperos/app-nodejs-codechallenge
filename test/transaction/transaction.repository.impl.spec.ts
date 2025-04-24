import { TransactionRepositoryImpl } from '../../src/modules/transaction/infrastructure/prisma/transaction.repository.impl';
import { PrismaService } from '../../src/modules/transaction/infrastructure/prisma/prisma.service';

describe('TransactionRepositoryImpl', () => {
  let repository: TransactionRepositoryImpl;
  let prisma: PrismaService;

  const mockTransaction = {
    id: 'tx-123',
    accountExternalIdDebit: 'acc-1',
    accountExternalIdCredit: 'acc-2',
    transferTypeId: 1,
    value: 1000,
    transactionStatusId: 1,
    createdAt: new Date(),
  };

  beforeEach(() => {
    prisma = {
      transaction: {
        findUnique: jest.fn().mockResolvedValue(mockTransaction),
        create: jest.fn().mockResolvedValue(mockTransaction),
        update: jest.fn().mockResolvedValue({ ...mockTransaction, transactionStatusId: 2 }),
      },
    } as any;

    repository = new TransactionRepositoryImpl(prisma);
  });

  it('should find a transaction by id', async () => {
    const result = await repository.findById('tx-123');
    expect(result).toEqual(mockTransaction);
    expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
      where: { id: 'tx-123' },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });
  });

  it('should save a new transaction', async () => {
    const result = await repository.save(mockTransaction);
    expect(result).toEqual(mockTransaction);
    expect(prisma.transaction.create).toHaveBeenCalled();
  });

  it('should update transaction status', async () => {
    const result = await repository.updateStatus('tx-123', 2);
    expect(result.transactionStatusId).toBe(2);
    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { id: 'tx-123' },
      data: { transactionStatusId: 2 },
    });
  });
});
