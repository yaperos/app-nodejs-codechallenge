/* eslint-disable @typescript-eslint/unbound-method */
import { UpdateTransactionsService } from './update-transactions.service';
import { TransactionPostgresRepository } from '../adapter/out/db/postgres/transaction-postgres.repository';
import { Logger } from 'nestjs-pino';
import { NotFoundException } from '@nestjs/common';
import { TransactionStatus } from '../entity/transaction-status.enum';
import { Transaction } from '../entity/transaction';
import { TransactionType } from '../entity/transaction-type.enum';

describe('UpdateTransactionsService', () => {
  let service: UpdateTransactionsService;
  let transactionDbRepo: jest.Mocked<TransactionPostgresRepository>;
  let logger: jest.Mocked<Logger>;

  beforeEach(() => {
    transactionDbRepo = {} as jest.Mocked<TransactionPostgresRepository>;
    logger = {} as jest.Mocked<Logger>;
    logger.warn = jest.fn();
    logger.debug = jest.fn();

    service = new UpdateTransactionsService(transactionDbRepo, logger);
  });

  it('given a transaction exists, when updating status, then transaction is updated', async () => {
    const transactionId = 'txn-123';
    const newStatus = TransactionStatus.APPROVED;
    const transaction = Transaction.fromPrimitives({
      id: transactionId,
      amount: 100,
      accountExternalIdDebit: 'payer-123',
      accountExternalIdCredit: 'payee-456',
      type: TransactionType.CREDIT,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: TransactionStatus.PENDING,
    });

    transactionDbRepo.findById = jest.fn().mockResolvedValue(transaction);
    transactionDbRepo.save = jest.fn();
    await service.updateStatus(transactionId, newStatus);

    expect(transactionDbRepo.findById).toHaveBeenCalledWith(transactionId);
    expect(transactionDbRepo.save).toHaveBeenCalled();
  });

  it('given a transaction does not exist, when updating status, then NotFoundException is thrown', async () => {
    const transactionId = 'non-existent-id';

    transactionDbRepo.findById = jest.fn().mockResolvedValue(null);

    await expect(
      service.updateStatus(transactionId, TransactionStatus.APPROVED),
    ).rejects.toThrow(NotFoundException);

    expect(transactionDbRepo.findById).toHaveBeenCalledWith(transactionId);
  });
});
