import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionService } from './transaction/transaction.service';
import { ValidationDto } from './models/valitation.dto';
import { Logger } from '@nestjs/common';
import { StatusEnum } from './models/Transaction.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './models/transaction.entity';
import { KafkaService } from './services/kafka.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
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

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('getHello', () => {
    it('should return the result from appService.getHello', () => {
      // Arrange
      jest
        .spyOn(appService, 'getHello')
        .mockReturnValue('Yape Challenge accepted!!!');

      // Act
      const result = appController.getHello();

      // Assert
      expect(result).toEqual('Yape Challenge accepted!!!');
      expect(appService.getHello).toHaveBeenCalled();
    });
  });

  describe('handleTransactionValidation', () => {
    it('should handle transaction validation and update status', () => {
      // Arrange
      const mockValidationDto: ValidationDto = {
        id: 'mockId',
        status: StatusEnum.APPROVED,
      };

      // Mock the Logger
      jest.spyOn(Logger.prototype, 'debug').mockImplementation();

      // Mock the transactionService's updateStatus method
      jest.spyOn(transactionService, 'updateStatus').mockImplementation();

      // Act
      appController.handleTransactionValidation(mockValidationDto);

      // Assert
      expect(Logger.prototype.debug).toHaveBeenCalledWith(
        'Transaction validation arrived mockId',
      );
      expect(transactionService.updateStatus).toHaveBeenCalledWith(
        'mockId',
        StatusEnum.APPROVED,
      );
    });
  });
});
