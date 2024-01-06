import { Test, TestingModule } from '@nestjs/testing';
import { ValidateTransactionService } from './validate-transaction.service';
import { LoggerService } from '@app/shared';
import { Repository } from 'typeorm';
import { LogValidateTransaction } from './entities/validate-transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ValidateTransactionService', () => {
  let service: ValidateTransactionService;
  let loggerService: LoggerService;
  let logValidateTransactionRepository: Repository<LogValidateTransaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateTransactionService,
        LoggerService,
        {
          provide: getRepositoryToken(LogValidateTransaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ValidateTransactionService>(
      ValidateTransactionService,
    );

    loggerService = module.get<LoggerService>(LoggerService);

    logValidateTransactionRepository = module.get<
      Repository<LogValidateTransaction>
    >(getRepositoryToken(LogValidateTransaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validationValue', () => {
    it('should validate the transaction value and save the record', async () => {
      // Mock data
      const createAntiFraudDto = {
        transactionExternalId: 'testTransactionId',
        value: 1000,
      };

      const savedRecord: LogValidateTransaction = {
        transactionExternalId: 'testTransactionId',
        maximumValue: 1000,
        value: 1000,
        status: 3,
        createdAt: new Date(),
        id: 1,
        asignarFechaActual: jest.fn(),
      };

      // Mock logValidateTransactionRepository
      jest
        .spyOn(logValidateTransactionRepository, 'create')
        .mockReturnValue(savedRecord);
      jest
        .spyOn(logValidateTransactionRepository, 'save')
        .mockResolvedValue(savedRecord);
      jest.spyOn(loggerService, 'info').mockImplementation(async () => {});

      // Execute the service method
      const result = await service.validationValue(createAntiFraudDto);
      console.log(result);
      // Assertions

      expect(logValidateTransactionRepository.save).toHaveBeenCalledWith(
        savedRecord,
      );

      expect(result).toEqual({
        transactionExternalId: 'testTransactionId',
        status: 3,
      });
    });
  });
});
