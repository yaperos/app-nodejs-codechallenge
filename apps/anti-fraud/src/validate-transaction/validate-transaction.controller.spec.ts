import { Test, TestingModule } from '@nestjs/testing';
import { ValidateTransactionController } from './validate-transaction.controller';
import { ValidateTransactionService } from './validate-transaction.service';
import { CreateAntiFraudDto, LoggerService } from '@app/shared';
import { ValidationTransaction } from '@app/shared/validation-transaction/validation-transaction.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('ValidateTransactionController', () => {
  let controller: ValidateTransactionController;
  let antiFraudService: ValidateTransactionService;
  let loggerService: LoggerService;
  let transactionClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidateTransactionController],
      providers: [
        ValidateTransactionService,
        LoggerService,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: {
            send: jest.fn(() => of({})),
            subscribeToResponseOf: jest.fn(),
          },
        },
      ],
      imports: [TypeOrmModule, ClientsModule],
    })
      .overrideProvider(ValidateTransactionService)
      .useValue({
        validationValue: jest.fn(),
      })
      .compile();

    controller = module.get<ValidateTransactionController>(
      ValidateTransactionController,
    );
    antiFraudService = module.get<ValidateTransactionService>(
      ValidateTransactionService,
    );
    loggerService = module.get<LoggerService>(LoggerService);
    transactionClient = module.get<ClientKafka>('TRANSACTION_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('transactionValidation', () => {
    it('should validate the transaction and send updateTransaction', async () => {
      // Mock data and services
      const createAntiFraudDto: CreateAntiFraudDto = {
        transactionExternalId: 'testTransactionId',
        value: 1000,
      };

      const validationResponse: ValidationTransaction = {
        transactionExternalId: 'testTransactionId',
        status: 2,
      };

      jest
        .spyOn(antiFraudService, 'validationValue')
        .mockResolvedValue(validationResponse);

      jest.spyOn(loggerService, 'info').mockImplementation(async () => {});
      jest.spyOn(transactionClient, 'send').mockReturnValue(of({}));

      // Execute the controller method
      await controller.transactionValidation(createAntiFraudDto);

      // Assertions
      expect(antiFraudService.validationValue).toHaveBeenCalledWith(
        createAntiFraudDto,
      );
      expect(transactionClient.send).toHaveBeenCalledWith(
        'updateTransaction',
        JSON.stringify(validationResponse),
      );
      expect(loggerService.info).toHaveBeenCalledTimes(3);
    });
  });
});
