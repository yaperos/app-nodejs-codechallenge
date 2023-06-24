import { TransactionsController } from './transactions.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { randomUUID } from 'crypto';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionStatus } from './enum/transaction-status';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionStatusEvent } from './event/update-transaction-status-event';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsServiceMock;

  beforeEach(async () => {
    transactionsServiceMock = {
      createTransaction: jest.fn(
        (request: CreateTransactionRequestDto): Promise<TransactionDto> => {
          const transactionDto = new TransactionDto(
            randomUUID(),
            request.transferTypeId,
            request.value,
            TransactionStatus.PENDING,
            new Date(),
          );
          return Promise.resolve(transactionDto);
        },
      ),
      retrieveAllTransactions: jest.fn(
        (): Promise<TransactionDto[]> => Promise.resolve([]),
      ),
      retrieveTransaction: jest.fn((id: string): Promise<TransactionDto> => {
        const transactionDto = new TransactionDto(
          id,
          1,
          600,
          TransactionStatus.APPROVED,
          new Date(),
        );
        return Promise.resolve(transactionDto);
      }),
      updateTransactionStatus: jest.fn(
        (event: UpdateTransactionStatusEvent): Promise<TransactionDto> => {
          const transactionDto = new TransactionDto(
            event.transactionExternalId,
            1,
            1200,
            event.status,
            new Date(),
          );
          return Promise.resolve(transactionDto);
        },
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: transactionsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a transaction', async () => {
    const request: CreateTransactionRequestDto = {
      accountExternalIdDebit: randomUUID(),
      transferTypeId: 1,
      value: 800,
    };
    const transactionDto = await controller.createTransaction(request);
    expect(transactionDto).toBeDefined();
    expect(transactionDto).toBeInstanceOf(TransactionDto);
    expect(transactionDto.transactionStatus).toEqual(TransactionStatus.PENDING);
    expect(transactionDto.transactionType).toEqual(request.transferTypeId);
    expect(transactionDto.value).toEqual(request.value);
    expect(transactionsServiceMock.createTransaction).toHaveBeenCalledTimes(1);
  });

  it('should get all transactions', async () => {
    const transactions = await controller.retrieveAllTransactions();
    expect(transactions).toBeDefined();
    expect(transactions).toBeInstanceOf(Array<TransactionDto>);
    expect(
      transactionsServiceMock.retrieveAllTransactions,
    ).toHaveBeenCalledTimes(1);
  });

  it('should get a transaction', async () => {
    const transactionId = randomUUID();
    const transactionDto = await controller.retrieveTransaction(transactionId);
    expect(transactionDto).toBeDefined();
    expect(transactionDto).toBeInstanceOf(TransactionDto);
    expect(transactionDto.transactionExternalId).toEqual(transactionId);
    expect(transactionDto.transactionType).toEqual(1);
    expect(transactionDto.transactionStatus).toEqual(
      TransactionStatus.APPROVED,
    );
    expect(transactionDto.value).toEqual(600);
    expect(transactionsServiceMock.retrieveTransaction).toHaveBeenCalledTimes(
      1,
    );
  });

  it('should handle the update transaction event', async () => {
    const updateEvent: UpdateTransactionStatusEvent =
      new UpdateTransactionStatusEvent(
        randomUUID(),
        TransactionStatus.REJECTED,
      );
    const transactionDto = await controller.handleUpdateTransactionStatus(
      updateEvent,
    );
    expect(transactionDto).toBeDefined();
    expect(transactionDto).toBeInstanceOf(TransactionDto);
    expect(transactionDto.transactionExternalId).toEqual(
      updateEvent.transactionExternalId,
    );
    expect(transactionDto.transactionStatus).toEqual(updateEvent.status);
    expect(
      transactionsServiceMock.updateTransactionStatus,
    ).toHaveBeenCalledTimes(1);
  });
});
