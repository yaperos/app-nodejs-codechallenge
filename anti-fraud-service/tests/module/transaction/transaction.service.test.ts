/* eslint-disable no-undef */
import { Kafka } from 'kafkajs';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { KafkaClient } from '../../../src/config/kafka';
import { ITransaction, TransactionStatus } from '../../../src/modules/transaction/transaction.interface';

const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

describe('Transaction Service tests', () => {
  let kafkaClient: KafkaClient;

  beforeAll(() => {
    const kafka = new Kafka({ brokers: ['any_host'] });
    kafkaClient = new KafkaClient(kafka);
  });

  beforeEach(() => {
    consoleErrorMock.mockClear();
  });

  // Tests for validate service
  describe('Validate transaction service', () => {
    const validTransaction: ITransaction = {
      transactionExternalId: 'clhzvk5sl000324osb1a4xu9h',
      accountExternalIdDebit: '12345',
      accountExternalIdCredit: '12345',
      transactionTypeId: 1,
      transactionStatus: TransactionStatus.PENDING,
      createdAt: new Date('2023-05-23T06:07:50.614Z'),
      value: 500,
    };

    const invalidTransaction: ITransaction = {
      ...validTransaction,
      value: 2000,
    };

    it('should change status to REJECTED if value is greater than 1000', async () => {
      const expected: ITransaction = {
        ...invalidTransaction,
        transactionStatus: TransactionStatus.REJECTED,
      };

      const transactionService = new TransactionService(kafkaClient);
      const res = await transactionService.validate(invalidTransaction);

      expect(res).toStrictEqual(expected);
    });

    it('should change status to APPROVED if value is less than 1001', async () => {
      const expected: ITransaction = {
        ...validTransaction,
        transactionStatus: TransactionStatus.APPROVED,
      };

      const transactionService = new TransactionService(kafkaClient);
      const res = await transactionService.validate(validTransaction);

      expect(res).toStrictEqual(expected);
    });

    it('should return the same transaction if status is not PENDING', async () => {
      const expected: ITransaction = {
        ...validTransaction,
        transactionStatus: TransactionStatus.APPROVED,
      };

      const transactionService = new TransactionService(kafkaClient);
      const res = await transactionService.validate(expected);

      expect(res).toStrictEqual(expected);
    });

    it('should return error if streamer throws error', async () => {
      const expected: ITransaction = {
        ...validTransaction,
        transactionStatus: TransactionStatus.APPROVED,
      };

      const transactionService = new TransactionService(kafkaClient);
      const res = await transactionService.validate(expected);

      expect(res).toStrictEqual(expected);
    });
  });
});
