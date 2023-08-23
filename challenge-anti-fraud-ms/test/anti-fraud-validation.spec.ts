import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import { AntiFraudValidationController } from 'src/module/interfaces/controller/v1/anti-fraud-validation.controller';
import { TransactionVerifyDto } from 'src/module/interfaces/controller/v1/dto/transaction-verify.dto';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { GetAntiFraudValidationEventCommandHandler } from 'src/module/application/command/anti-fraud-validation.command';
import { AntiFraudValidationInfrastructure } from 'src/module/infrastructure/anti-fraud-validation.infrastructure';

describe('AntiFraudValidationController', () => {
  let app: INestApplication;
  let controller: AntiFraudValidationController;
  const mockCommandBus = {
    execute: jest.fn(),
  };

  const mockClientKafka = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetModules();
    jest.restoreAllMocks();
    const providersApplication = [GetAntiFraudValidationEventCommandHandler];
    const providersInfrastructure = [AntiFraudValidationInfrastructure];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudValidationController],
      providers: [
        Logger,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: ClientKafka,
          useValue: mockClientKafka,
        },
        {
          provide: 'ANTI_FRAUD_EMITTER_MS',
          useValue: 'ANTI_FRAUD_EMITTER_MS', // Reemplaza 'valor_deseado' con el valor real que necesitas.
        },
        ...providersApplication,
        ...providersInfrastructure,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    controller = app.get<AntiFraudValidationController>(
      AntiFraudValidationController,
    );
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleEventValidateTransaction', () => {
    it('should execute GetAntiFraudValidationEventCommand', async () => {
      const transactionVerifyDto: TransactionVerifyDto = {
        transactionExternalId: 'b97bf685-0320-4e4c-b532-b27c3154fa98',
        value: 100,
      };

      await controller.handleEventValidateTransaction(transactionVerifyDto);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionExternalId: transactionVerifyDto.transactionExternalId,
          value: transactionVerifyDto.value,
        }),
      );
    });
  });
});
