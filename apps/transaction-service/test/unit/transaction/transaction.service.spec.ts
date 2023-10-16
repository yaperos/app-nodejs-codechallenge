import { Logger } from '@logger/logger.service';
import { TransactionStatusDBService } from '../../../src/modules/db-module/transaction-db/transaction-status.db.service';
import { TransactionTypeDBService } from '../../../src/modules/db-module/transaction-db/transaction-type.db.service';
import { TransactionDBService } from '../../../src/modules/db-module/transaction-db/transaction.db.service';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockTransaction,
  mockTransactionExternalId,
  mockTransactionRequest,
  mockTransactionResponse,
  mockTransactionStatus,
  mockTransactionType,
} from './mock-data';
import { TransactionStatusEnum } from 'constants/antifraud';
const mockEmit = jest.fn();

describe('TransactionService', () => {
  let testingModule: TestingModule;
  let service: TransactionService;
  let spyLogger: Logger;
  let spyTransactionDBService: TransactionDBService;
  let spyTransactionStatusDBService: TransactionStatusDBService;
  let spyTransactionTypeDBService: TransactionTypeDBService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: mockEmit,
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
        {
          provide: TransactionDBService,
          useFactory: () => ({
            createTransaction: jest.fn(),
            updateTransactionByCriteria: jest.fn(),
            findTransactionByExternalId: jest.fn(),
          }),
        },
        {
          provide: TransactionStatusDBService,
          useFactory: () => ({
            findTransactionStatusById: jest.fn(),
          }),
        },
        {
          provide: TransactionTypeDBService,
          useFactory: () => ({
            findTransactionTypeById: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = testingModule.get<TransactionService>(TransactionService);
    spyLogger = testingModule.get<Logger>(Logger);
    spyTransactionDBService =
      testingModule.get<TransactionDBService>(TransactionDBService);
    spyTransactionStatusDBService =
      testingModule.get<TransactionStatusDBService>(TransactionStatusDBService);
    spyTransactionTypeDBService = testingModule.get<TransactionTypeDBService>(
      TransactionTypeDBService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction service', () => {
    it('should create a transaction', async () => {
      // Arrange
      jest.spyOn(service, 'saveTransaction').mockResolvedValue(mockTransaction);
      jest.spyOn(service, 'validateTransactionValue').mockResolvedValue();
      // Act
      const response = await service.createTransaction(mockTransactionRequest);
      // Assert
      expect(response).toEqual(mockTransactionResponse);
    });

    it('should handle errors during transaction creation', async () => {
      // Arrange
      const mockError = new Error('test error');
      jest.spyOn(service, 'saveTransaction').mockRejectedValue(mockError);
      try {
        // Act
        await service.createTransaction(mockTransactionRequest);
      } catch (e) {
        // Assert
        expect(e).toBeInstanceOf(Error);
        expect(spyLogger.error).toHaveBeenCalledWith(
          'Error on createTransaction',
          mockError.message,
        );
      }
    });
  });

  describe('saveTransaction', () => {
    it('should save a transaction', async () => {
      // Arrange
      jest
        .spyOn(spyTransactionTypeDBService, 'findTransactionTypeById')
        .mockResolvedValue(mockTransactionType);
      jest
        .spyOn(spyTransactionStatusDBService, 'findTransactionStatusById')
        .mockResolvedValue(mockTransactionStatus);
      jest
        .spyOn(spyTransactionDBService, 'createTransaction')
        .mockResolvedValue(mockTransaction);
      // Act
      const response = await service.saveTransaction(mockTransactionRequest);
      // Assert
      expect(
        spyTransactionStatusDBService.findTransactionStatusById,
      ).toHaveBeenCalled();
      expect(
        spyTransactionTypeDBService.findTransactionTypeById,
      ).toHaveBeenCalled();
      expect(spyTransactionDBService.createTransaction).toHaveBeenCalled();
      expect(response).toEqual(mockTransaction);
    });
  });

  describe('validateTransactionValue', () => {
    it('should validate a transaction value', async () => {
      await service.validateTransactionValue(
        mockTransactionExternalId,
        mockTransactionRequest.value,
      );
      expect(spyLogger.log).toHaveBeenCalled();
      expect(mockEmit).toHaveBeenCalled();
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction', async () => {
      // Arrange
      jest
        .spyOn(spyTransactionDBService, 'updateTransactionByCriteria')
        .mockResolvedValue();
      // Act
      await service.updateTransaction(
        mockTransactionExternalId,
        TransactionStatusEnum.APPROVED,
      );
      // Assert
      expect(spyLogger.log).toHaveBeenCalled();
      expect(
        spyTransactionDBService.updateTransactionByCriteria,
      ).toHaveBeenCalled();
    });
  });

  describe('searchTransaction', () => {
    it('should search for a transaction', async () => {
      // Arrange
      jest
        .spyOn(spyTransactionDBService, 'findTransactionByExternalId')
        .mockResolvedValue(mockTransaction);
      // Act
      const response = await service.searchTransaction(
        mockTransactionExternalId,
      );
      // Assert
      expect(spyLogger.log).toHaveBeenCalled();
      expect(response).toEqual(mockTransactionResponse);
    });
  });
});
