import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { TransactionController } from 'src/transaction/transaction.controller';
import { TransactionService } from 'src/transaction/transaction.service';
import { KafkaProducerService } from 'src/core/kafka/kafka-producer.service';
import { ConsumeTransactionDto } from 'src/transaction/dto';

const mockKafkaProducerService = {
  emit: jest.fn(),
};

const createTestTransaction = (
  amount: number,
): ConsumeTransactionDto => ({
  transactionId: 'test-transaction-id',
  amount,
});

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [TransactionController],
        providers: [
          TransactionService,
          {
            provide: KafkaProducerService,
            useValue: mockKafkaProducerService,
          },
        ],
      }).compile();

    controller =
      module.get<TransactionController>(
        TransactionController,
      );
    service = module.get<TransactionService>(
      TransactionService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should approve transaction with amount less than limit', async () => {
    const transaction =
      createTestTransaction(999);
    mockKafkaProducerService.emit.mockResolvedValue(
      undefined,
    );

    await controller.consumeTransaction(
      transaction,
    );

    expect(
      mockKafkaProducerService.emit,
    ).toHaveBeenCalledWith(
      'transaction-status-update',
      {
        transactionId: transaction.transactionId,
        status: 'APPROVED',
      },
    );
  });

  it('should reject transaction with amount greater than or equal to limit', async () => {
    const transaction =
      createTestTransaction(1000);
    mockKafkaProducerService.emit.mockResolvedValue(
      undefined,
    );

    await controller.consumeTransaction(
      transaction,
    );

    expect(
      mockKafkaProducerService.emit,
    ).toHaveBeenCalledWith(
      'transaction-status-update',
      {
        transactionId: transaction.transactionId,
        status: 'REJECTED',
      },
    );
  });

  // Add more test cases as needed
});
