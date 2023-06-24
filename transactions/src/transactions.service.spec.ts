import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { randomUUID } from 'crypto';
import { TransactionStatus } from './enum/transaction-status';
import { UpdateTransactionStatusEvent } from './event/update-transaction-status-event';
import { TransactionDto } from './dto/transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let antiFraudClientMock;
  let transactionsRepositoryMock;

  beforeEach(async () => {
    antiFraudClientMock = {
      emit: jest.fn((pattern: string, data: any) => {
        console.log(`Emitted event: ${pattern} with data: ${data}`);
      }),
    };
    transactionsRepositoryMock = {
      find: jest.fn((): Promise<Transaction[]> => Promise.resolve([])),
      findOneBy: jest.fn((options: any): Promise<Transaction> => {
        return Promise.resolve({
          transactionExternalId: options.transactionExternalId,
          transferTypeId: 1,
          value: 500,
          status: TransactionStatus.APPROVED,
          createdAt: new Date(),
        });
      }),
      create: jest.fn((transaction: Transaction): Transaction => {
        return {
          transactionExternalId: randomUUID(),
          ...transaction,
        };
      }),
      save: jest.fn(
        (transaction: Transaction): Promise<Transaction> =>
          Promise.resolve(transaction),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: 'ANTI_FRAUD_MICROSERVICE',
          useValue: antiFraudClientMock,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: transactionsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction', async () => {
    const request: CreateTransactionRequestDto = {
      accountExternalIdDebit: randomUUID(),
      transferTypeId: 1,
      value: 80,
    };
    const transactionDto = await service.createTransaction(request);
    expect(transactionDto).toBeDefined();
    expect(transactionDto).toBeInstanceOf(TransactionDto);
    expect(transactionDto.value).toEqual(request.value);
    expect(transactionDto.transactionStatus).toEqual(TransactionStatus.PENDING);
    expect(transactionsRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(transactionsRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(antiFraudClientMock.emit).toHaveBeenCalledTimes(1);
  });

  it('should retrieve all transactions', async () => {
    const transactions = await service.retrieveAllTransactions();
    expect(transactions).toBeDefined();
    expect(transactions).toBeInstanceOf(Array<TransactionDto>);
    expect(transactionsRepositoryMock.find).toHaveBeenCalledTimes(1);
  });

  it('should retrieve a transaction', async () => {
    const transactionId = randomUUID();
    const transactionDto = await service.retrieveTransaction(transactionId);
    expect(transactionDto).toBeDefined();
    expect(transactionDto).toBeInstanceOf(TransactionDto);
    expect(transactionDto.transactionExternalId).toEqual(transactionId);
    expect(transactionDto.transactionStatus).toEqual(
      TransactionStatus.APPROVED,
    );
    expect(transactionsRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('should update the transaction status', async () => {
    const request = new UpdateTransactionStatusEvent(
      randomUUID(),
      TransactionStatus.REJECTED,
    );

    const updatedTransaction = await service.updateTransactionStatus(request);
    expect(updatedTransaction).toBeDefined();
    expect(updatedTransaction).toBeInstanceOf(TransactionDto);
    expect(updatedTransaction.transactionExternalId).toEqual(
      request.transactionExternalId,
    );
    expect(updatedTransaction.transactionStatus).toEqual(
      TransactionStatus.REJECTED,
    );
    expect(transactionsRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    expect(transactionsRepositoryMock.save).toHaveBeenCalledTimes(1);
  });
});
