import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices'; // Importa ClientKafka
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { TransactionVerifyController } from 'src/module/interfaces/http/v1/transaction/transaction-verify.controller';
import { TransactionVerifyInfrastructure } from 'src/module/infrastructure/transacion-verify.infrastructure';
import { GetTransactionVerifyEventCommandHandler } from 'src/module/application/query/get-transaction-verify-event.query';
import { GetTransactionVerifyDto } from 'src/module/interfaces/http/v1/transaction/dto/get-transaction-verify-by-id.dto';
import { CreateTransactionVerifyDto } from 'src/module/interfaces/http/v1/transaction/dto/create-transaction-verify.dto';
import { TransactionVerifyRequestDto } from 'src/module/interfaces/http/v1/transaction/dto/transaction-verify-request.dto';

describe('TransactionVerifyController', () => {
  let app: INestApplication;
  let controller: TransactionVerifyController;
  const mockCommandBus = {
    execute: jest.fn(),
  };

  const mockQueryBus = {
    execute: jest.fn(),
  };

  const mockClientKafka = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetModules();
    jest.restoreAllMocks();
    const providersApplication = [GetTransactionVerifyEventCommandHandler];
    const providersInfrastructure = [TransactionVerifyInfrastructure];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionVerifyController],
      providers: [
        Logger,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        { provide: QueryBus, useValue: mockQueryBus },
        {
          provide: ClientKafka,
          useValue: mockClientKafka,
        },
        {
          provide: 'TransactionVerifyEntityRepository',
          useValue: 'TransactionVerifyEntityRepository',
        },
        {
          provide: 'KAFKA_TRANSACTION_EMITTER_MS',
          useValue: 'KAFKA_TRANSACTION_EMITTER_MS', // Reemplaza 'valor_deseado' con el valor real que necesitas.
        },
        ...providersApplication,
        ...providersInfrastructure,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    controller = app.get<TransactionVerifyController>(
      TransactionVerifyController,
    );
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('TransactionVerifyController', () => {
    it('should execute getTransactionVerify', async () => {
      await controller.getTransactionVerify({
        transactionExternalId: 'd5ae4c6e-7a27-4bea-89d1-58e8ee42a591',
      } as GetTransactionVerifyDto);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionExternalId: 'd5ae4c6e-7a27-4bea-89d1-58e8ee42a591',
        }),
      );
    });

    it('should execute CreateTransactionVerifyDto', async () => {
      const createTransactionVerifyDto: CreateTransactionVerifyDto = {
        accountExternalIdDebit: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
        accountExternalIdCredit: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
        transferTypeId: 2,
        value: 1000,
      };
      await controller.saveTransactionVerify(createTransactionVerifyDto);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionVerifyRequest: {
            accountExternalIdCredit: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
            accountExternalIdDebit: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
            transferTypeId: 2,
            value: 1000,
          },
        }),
      );
    });

    it('should execute handleEventUpdateStatusTransactionVerify', async () => {
      const transactionVerifyRequestDto: TransactionVerifyRequestDto = {
        transactionExternalId: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
        status: 'APPROVED',
      };
      await controller.handleEventUpdateStatusTransactionVerify(
        transactionVerifyRequestDto,
      );

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionVerifyRequest: {
            status: 'APPROVED',
            transactionExternalId: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
          },
        }),
      );
    });
  });
});
