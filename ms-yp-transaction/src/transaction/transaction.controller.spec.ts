import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { mockCreate, mockSave } from '../mockDataTest';
import { createTransactionEvent } from '../utils/createdTransactionEvent';
import { TransactionStatusEnum } from './enums/transaction.status.enum';
import { TRANSACTION_CREATED } from '../constants/common';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: TransactionService;
  let transactionClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: 'ANTIFRAUD_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
    transactionClient = module.get<ClientKafka>('ANTIFRAUD_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(transactionClient).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction and emit an event', async () => {
      const mockCreateTransactionDto: CreateTransactionDto = mockCreate;
      const mockTransactionCreated = mockSave;

      jest
        .spyOn(transactionService, 'create')
        .mockResolvedValue(mockTransactionCreated);

      const result = await controller.create(mockCreateTransactionDto);
      expect(transactionService.create).toHaveBeenCalledTimes(1);
      expect(transactionService.create).toHaveBeenCalledWith(
        mockCreateTransactionDto,
      );
      expect(transactionClient.emit).toHaveBeenCalledTimes(1);
      expect(transactionClient.emit).toHaveBeenCalledWith(
        TRANSACTION_CREATED,
        createTransactionEvent(mockTransactionCreated),
      );
      expect(result).toEqual(mockSave);
    });
  });

  describe('handleUpdatedTransactionStatus', () => {
    it('should update transaction status', async () => {
      const mockPayload = {
        id: 'mockId',
        transactionStatus: TransactionStatusEnum.PENDING,
      };

      await controller.handleUpdatedTransactionStatus(mockPayload);

      expect(transactionService.update).toHaveBeenCalledWith(
        mockPayload.id,
        mockPayload.transactionStatus,
      );
    });
  });
});
