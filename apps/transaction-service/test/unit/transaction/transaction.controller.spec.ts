import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../../src/modules/transaction/transaction.controller';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { Logger } from '@logger/logger.service';
import {
  mockTransactionExternalId,
  mockTransactionRequest,
  mockTransactionResponse,
} from './mock-data';
import { TransactionStatusEnum } from 'constants/antifraud';

describe('TransactionController', () => {
  let testingModule: TestingModule;
  let controller: TransactionController;
  let spyTransactionService: TransactionService;
  let spyLogger: Logger;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useFactory: () => ({
            createTransaction: jest.fn(),
            searchTransaction: jest.fn(),
            updateTransaction: jest.fn(),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = testingModule.get<TransactionController>(
      TransactionController,
    );
    spyTransactionService =
      testingModule.get<TransactionService>(TransactionService);
    spyLogger = testingModule.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction function', () => {
    it('should create a transaction', async () => {
      // Arrange
      jest
        .spyOn(spyTransactionService, 'createTransaction')
        .mockResolvedValue(mockTransactionResponse);
      // Act
      const response = await controller.createTransaction(
        mockTransactionRequest,
      );
      // Assert
      expect(spyLogger.log).toHaveBeenCalled();
      expect(spyTransactionService.createTransaction).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockTransactionResponse);
    });

    it('should handle errors during transaction creation', async () => {
      // Arrange
      const mockError = new Error('test error');
      jest
        .spyOn(spyTransactionService, 'createTransaction')
        .mockRejectedValue(mockError);

      try {
        // Act
        await controller.createTransaction(mockTransactionRequest);
      } catch (e) {
        // Assert
        expect(spyLogger.error).toHaveBeenCalledWith(
          'Error creating transaction',
          mockError.message,
        );
      }
    });
  });

  describe('searchTransaction function', () => {
    it('should retrive a transaction by external id', async () => {
      // Arrange
      jest
        .spyOn(spyTransactionService, 'searchTransaction')
        .mockResolvedValue(mockTransactionResponse);
      // Act
      const response = await controller.searchTransaction(
        mockTransactionExternalId,
      );
      // Assert
      expect(spyLogger.log).toHaveBeenCalled();
      expect(spyTransactionService.searchTransaction).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockTransactionResponse);
    });

    it('should handle errors during transaction fetching', async () => {
      // Arrange
      const mockError = new Error('test error');
      jest
        .spyOn(spyTransactionService, 'searchTransaction')
        .mockRejectedValue(mockError);

      try {
        // Act
        await controller.searchTransaction(mockTransactionExternalId);
      } catch (e) {
        // Assert
        expect(spyLogger.error).toHaveBeenCalledWith(
          'Error fetching transaction',
          mockError.message,
        );
      }
    });
  });

  describe('handleUpdateTransactionStatus function', () => {
    it('should update a transaction status', async () => {
      // Arrange
      jest
        .spyOn(spyTransactionService, 'updateTransaction')
        .mockResolvedValue();
      // Act
      await controller.handleUpdateTransactionStatus({
        transactionId: mockTransactionExternalId,
        status: TransactionStatusEnum.APPROVED,
      });
      // Assert
      expect(spyLogger.log).toHaveBeenCalled();
      expect(spyTransactionService.updateTransaction).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during transaction update', async () => {
      // Arrange
      const mockError = new Error('test error');
      jest
        .spyOn(spyTransactionService, 'updateTransaction')
        .mockRejectedValue(mockError);

      try {
        // Act
        await controller.handleUpdateTransactionStatus({
          transactionId: mockTransactionExternalId,
          status: TransactionStatusEnum.APPROVED,
        });
      } catch (e) {
        // Assert
        expect(spyLogger.error).toHaveBeenCalledWith(
          'Error creating transaction',
          mockError.message,
        );
      }
    });
  });
});
