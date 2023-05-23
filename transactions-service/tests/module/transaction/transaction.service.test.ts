/* eslint-disable no-undef */
import { Kafka } from 'kafkajs';
import { Transaction as PrismaTransaction, TransactionStatus, TransactionType as PrismaTransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { KafkaClient } from '../../../src/config/kafka';
import { Transaction, TransactionInput } from '../../../src/graphql/types/types';

let kafkaClient: KafkaClient;

const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

describe('Transaction Service tests', () => {
  beforeAll(() => {
    const kafka = new Kafka({ brokers: ['any_host'] });
    kafkaClient = new KafkaClient(kafka);
  });

  beforeEach(() => {
    consoleErrorMock.mockClear();
  });

  // Tests for get transaction by id service
  describe('Get transaction by Id service', () => {
    it('should fetch a transaction correctly', async () => {
      const prismaResponse: PrismaTransaction = {
        transactionExternalId: 'clhzvk5sl000324osb1a4xu9h',
        accountExternalIdDebit: '12345',
        accountExternalIdCredit: '12345',
        transactionTypeId: 1,
        transactionStatus: TransactionStatus.REJECTED,
        createdAt: new Date('2023-05-23T06:07:50.614Z'),
        value: new Decimal(2000),
      };

      const expected: Transaction = {
        ...prismaResponse,
        value: 2000,
        transactionStatus: TransactionStatus.REJECTED,
      };

      prismaMock.transaction.findUnique.mockResolvedValueOnce(prismaResponse);

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const res = await transactionService.get('clhzvk5sl000324osb1a4xu9h');

      expect(res).toStrictEqual(expected);
    });

    it('should return error if transaction not found', async () => {
      prismaMock.transaction.findUnique.mockResolvedValueOnce(null);

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      await expect(transactionService.get('123')).rejects.toThrow('Transaction not found');
    });

    it('should return error if database throws error', async () => {
      prismaMock.transaction.findUnique.mockRejectedValueOnce({ message: 'Something went wrong' });

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      await expect(transactionService.get('123')).rejects.toThrow('Error while getting transaction');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  // Tests for create transaction service
  describe('Create transaction service', () => {
    const prismaResponse: PrismaTransaction = {
      transactionExternalId: 'clhzvk5sl000324osb1a4xu9h',
      accountExternalIdDebit: '12345',
      accountExternalIdCredit: '12345',
      transactionTypeId: 1,
      transactionStatus: TransactionStatus.PENDING,
      createdAt: new Date('2023-05-23T06:07:50.614Z'),
      value: new Decimal(500),
    };

    const prismaTransactionType: PrismaTransactionType = {
      id: 1,
      name: 'Transaction 1',
    };

    const correctInput: TransactionInput = {
      accountExternalIdDebit: '12345',
      accountExternalIdCredit: '12345',
      transactionTypeId: 1,
      value: 500,
    };

    it('should create a transaction correctly', async () => {
      const expected: Transaction = {
        ...prismaResponse,
        value: 500,
        transactionStatus: TransactionStatus.PENDING,
      };

      prismaMock.transactionType.findUnique.mockResolvedValueOnce(prismaTransactionType);
      prismaMock.transaction.create.mockResolvedValueOnce(prismaResponse);

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const res = await transactionService.create(correctInput);
      expect(res).toEqual(expected);
    });

    it('should create a transaction correctly with decimal value', async () => {
      const correctInputWithDecimal: TransactionInput = {
        ...correctInput,
        value: 150.50,
      };
      const decimalPrismaResponse: PrismaTransaction = {
        ...prismaResponse,
        value: new Decimal(150.5),
      };
      const expected: Transaction = {
        ...decimalPrismaResponse,
        value: 150.5,
        transactionStatus: TransactionStatus.PENDING,
      };

      prismaMock.transactionType.findUnique.mockResolvedValueOnce(prismaTransactionType);
      prismaMock.transaction.create.mockResolvedValueOnce(decimalPrismaResponse);

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const res = await transactionService.create(correctInputWithDecimal);
      expect(res).toEqual(expected);
    });

    it('should return error if transaction type does not exist', async () => {
      const wrongTypeInput: TransactionInput = {
        ...correctInput,
        transactionTypeId: 100,
      };

      prismaMock.transactionType.findUnique.mockResolvedValueOnce(null);

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const createPromise = transactionService.create(wrongTypeInput);
      await expect(createPromise).rejects.toThrow('Transaction type does not exists');
    });

    it('should return error if transaction value is less than 1', async () => {
      const wrongValueInput: TransactionInput = {
        ...correctInput,
        value: -100,
      };

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const createPromise = transactionService.create(wrongValueInput);
      await expect(createPromise).rejects.toThrow('Transaction value cannot be 0 or less');
    });

    it('should return error if database throws error', async () => {
      prismaMock.transactionType.findUnique.mockResolvedValueOnce(prismaTransactionType);
      prismaMock.transaction.create.mockRejectedValueOnce({ message: 'Something went wrong' });

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const createPromise = transactionService.create(correctInput);
      await expect(createPromise).rejects.toThrow('Error while creating transaction');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  // Tests for update transaction status service
  describe('Update transaction status service', () => {
    const prismaResponse: PrismaTransaction = {
      transactionExternalId: 'clhzvk5sl000324osb1a4xu9h',
      accountExternalIdDebit: '12345',
      accountExternalIdCredit: '12345',
      transactionTypeId: 1,
      transactionStatus: TransactionStatus.REJECTED,
      createdAt: new Date('2023-05-23T06:07:50.614Z'),
      value: new Decimal(2000),
    };

    it('should update transaction status to rejected correctly', async () => {
      const expected: Transaction = {
        ...prismaResponse,
        value: 2000,
        transactionStatus: TransactionStatus.REJECTED,
      };

      prismaMock.transaction.update.mockResolvedValueOnce(prismaResponse);

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const res = await transactionService.updateStatus('clhzvk5sl000324osb1a4xu9h', TransactionStatus.REJECTED);
      expect(res).toEqual(expected);
    });

    it('should update transaction status to approved correctly', async () => {
      const approvedPrismaResponse: PrismaTransaction = {
        ...prismaResponse,
        value: new Decimal(100),
        transactionStatus: TransactionStatus.APPROVED,
      };
      const expected: Transaction = {
        ...approvedPrismaResponse,
        value: 100,
      };

      prismaMock.transaction.update.mockResolvedValueOnce(approvedPrismaResponse);

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const res = await transactionService.updateStatus('clhzvk5sl000324osb1a4xu9h', TransactionStatus.APPROVED);
      expect(res).toEqual(expected);
    });

    it('should return error if database throws error', async () => {
      prismaMock.transaction.update.mockRejectedValueOnce({ message: 'Something went wrong' });

      const transactionService = new TransactionService(prismaMock, kafkaClient);

      const updatePromise = transactionService.updateStatus('clhzvk5sl000324osb1a4xu9h', TransactionStatus.APPROVED);
      await expect(updatePromise).rejects.toThrow('Error while updating transaction');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
  });
});
