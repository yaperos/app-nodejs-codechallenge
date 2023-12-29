import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { StatusEnum, TransactionDto } from 'src/models/transaction.dto';
import { Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from 'src/models/transaction.entity';
import { KafkaService } from 'src/services/kafka.service';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useClass: Repository,
        },
        {
          provide: KafkaService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionController = module.get<TransactionController>(
      TransactionController,
    );
    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('getAll', () => {
    it('should return all transactions', async () => {
      // Arrange
      const mockTransactions: TransactionDto[] = [
        // Mock some transactions
      ];

      jest
        .spyOn(transactionService, 'getAll')
        .mockResolvedValue(mockTransactions);

      // Act
      const result = await transactionController.getAll();

      // Assert
      expect(result).toEqual(mockTransactions);
      expect(transactionService.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a transaction by id', async () => {
      // Arrange
      const mockTransaction: TransactionDto = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };

      jest
        .spyOn(transactionService, 'getOne')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await transactionController.getOne({ id: 'mockId' });

      // Assert
      expect(result).toEqual(mockTransaction);
      expect(transactionService.getOne).toHaveBeenCalledWith('mockId');
    });
  });

  describe('save', () => {
    it('should save a transaction', async () => {
      // Arrange
      const mockTransaction: TransactionDto = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };

      jest.spyOn(transactionService, 'save').mockResolvedValue(mockTransaction);

      // Act
      const result = await transactionController.save(mockTransaction);

      // Assert
      expect(result).toEqual(mockTransaction);
      expect(transactionService.save).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a transaction', async () => {
      // Arrange
      const mockTransaction: TransactionDto = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };

      jest
        .spyOn(transactionService, 'updateStatus')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await transactionController.updateStatus(
        mockTransaction,
        mockTransaction,
      );

      // Assert
      expect(result).toEqual(mockTransaction);
      expect(transactionService.updateStatus).toHaveBeenCalledWith(
        mockTransaction.id,
        mockTransaction.status,
      );
    });
  });
});
