import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudController } from '../../../src/modules/antifraud/antifraud.controller';
import { AntifraudService } from '../../../src/modules/antifraud/antifraud.service';
import { Logger } from '@logger/logger.service';
import { AntifraudRequestDto } from 'apps/antifraud-service/src/modules/antifraud/dto/antifraud.dto';

describe('AntifraudController', () => {
  let testingModule: TestingModule;
  let controller: AntifraudController;
  let spyAntifraudService: AntifraudService;
  let spylogger: Logger;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AntifraudController],
      providers: [
        {
          provide: AntifraudService,
          useFactory: () => ({
            validateTransaction: jest.fn(),
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

    controller = testingModule.get<AntifraudController>(AntifraudController);
    spyAntifraudService = testingModule.get<AntifraudService>(AntifraudService);
    spylogger = testingModule.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleTransactionAmountValidation', () => {
    it('should call the logger with the correct message', async () => {
      const mockDto: AntifraudRequestDto = {
        value: 100,
        transactionId: 'someTransactionId',
      };

      const loggerSpy = jest.spyOn(spylogger, 'log');

      await controller.handleTransactionAmountValidation(mockDto);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Starting transaction validation for ID someTransactionId',
      );
    });

    it('should call antifraudService.validateTransaction with the correct arguments', async () => {
      const mockDto: AntifraudRequestDto = {
        value: 100,
        transactionId: 'someTransactionId',
      };

      const validateTransactionSpy = jest.spyOn(
        spyAntifraudService,
        'validateTransaction',
      );

      await controller.handleTransactionAmountValidation(mockDto);

      expect(validateTransactionSpy).toHaveBeenCalledWith(
        'someTransactionId',
        100,
      );
    });

    it('should call the logger with success message after successful validation', async () => {
      const mockDto: AntifraudRequestDto = {
        value: 100,
        transactionId: 'someTransactionId',
      };

      jest
        .spyOn(spyAntifraudService, 'validateTransaction')
        .mockResolvedValueOnce(undefined);
      const loggerSpy = jest.spyOn(spylogger, 'log');

      await controller.handleTransactionAmountValidation(mockDto);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Transaction validated successfully',
      );
    });

    it('should call the logger with error message in case of an error', async () => {
      const mockDto: AntifraudRequestDto = {
        value: 100,
        transactionId: 'someTransactionId',
      };

      const errorMessage = 'Some error message';
      jest
        .spyOn(spyAntifraudService, 'validateTransaction')
        .mockRejectedValueOnce(new Error(errorMessage));
      const loggerErrorSpy = jest.spyOn(spylogger, 'error');

      try {
        await controller.handleTransactionAmountValidation(mockDto);
      } catch (e) {
        expect(loggerErrorSpy).toHaveBeenCalledWith(
          'Error in handleTransactionAmountValidation',
          errorMessage,
        );
      }
    });
  });
});
