import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModel } from '@src/transaction.model';
import {
  TransactionModelMock,
  transactionBody,
  transactionResponse,
  transactions,
} from '../mocks/transaction.mock';
import { STATUS } from '@prisma/client';

describe('TransactionService', () => {
  let service: TransactionModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionModel,
          useValue: TransactionModelMock,
        },
      ],
    }).compile();

    service = module.get<TransactionModel>(TransactionModel);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return all transactions', () => {
    const result = service.transactions();
    expect(result).toBe(transactions);
  });

  it('Should fetch a single transaction', () => {
    const transactionId = '651d7d6f9a7c544dfF43QSD';
    const result = service.transaction(transactionId);
    expect(result).toBe(transactions[0]);
  });

  it('Should create a new transaction', () => {
    const result = service.createTransaction(transactionBody);
    expect(result).toBe(transactionResponse);
  });

  it('Should have status REJECTED for high value transaction', () => {
    const result = service.createTransaction({
      ...transactionBody,
      value: 1200,
    });
    expect(result['status']).toBe(STATUS.REJECTED);
  });

  it('Should have status PENDING for regular transaction', () => {
    const result = service.createTransaction(transactionBody);
    expect(result['status']).toBe(STATUS.PENDING);
  });

  it('Should have status APPROVED for an existing transaction', () => {
    const result = service.transaction('878967d97979ds7967879');
    expect(result['status']).toBe(STATUS.APPROVED);
  });
});
