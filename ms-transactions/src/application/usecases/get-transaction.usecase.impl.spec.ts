import { GetTransactionUseCaseImpl } from './get-transaction.usecase.impl';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction';
import {
  TransactionStatus,
  TransactionType,
} from '../../domain/enums/transaction.enums';
import { NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';

describe('GetTransactionUseCaseImpl', () => {
  let useCase: GetTransactionUseCaseImpl;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let findByIdSpy: jest.SpyInstance;

  beforeEach(() => {
    transactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<TransactionRepository>;
    findByIdSpy = jest.spyOn(transactionRepository, 'findById');
    useCase = new GetTransactionUseCaseImpl(transactionRepository);
  });

  it('should return transaction if found', async () => {
    expect.hasAssertions();
    const transaction: Transaction = {
      id: 'tx1',
      accountDebit: '550e8400-e29b-41d4-a716-446655440000',
      accountCredit: '550e8400-e29b-41d4-a716-446655440001',
      transferType: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      value: new Decimal(100),
      createdAt: new Date(),
    };
    findByIdSpy.mockResolvedValue(transaction);

    const result = await useCase.execute('tx1');

    expect(result).toBe(transaction);
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenLastCalledWith('tx1');
  });

  it('should throw NotFoundException if not found', async () => {
    expect.hasAssertions();
    findByIdSpy.mockResolvedValue(null);

    await expect(useCase.execute('notfound')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(findByIdSpy).toHaveBeenCalledWith('notfound');
  });
});
