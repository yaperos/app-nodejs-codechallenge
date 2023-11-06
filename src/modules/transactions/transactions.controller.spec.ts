import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, KafkaContext, Transport } from '@nestjs/microservices';
import { Response } from 'express';
import { Repository } from 'typeorm';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { KafkaService } from '@shared/kafka/kafka.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsEntity } from '@entities/transactions.entity';
import { API_NAME } from '@config/app';
import { CreateTransactionDto, TransactionDto } from './transactions.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let transactionsRepository: Repository<TransactionsEntity>;

  beforeEach(async () => {
    await jest.restoreAllMocks();
    await jest.resetModules();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: API_NAME,
            transport: Transport.KAFKA,
            options: {
              consumer: { groupId: 'test-group' },
              client: {
                brokers: ['localhost:9092', 'localhost:9093'],
              },
            },
          },
        ]),
      ],
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        KafkaService,
        {
          provide: 'KafkaService',
          useFactory: () => {
            return {
              emit: () => ({
                toPromise: jest.fn(),
              }),
            };
          },
        },
        {
          provide: getRepositoryToken(TransactionsEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<Repository<TransactionsEntity>>(
      getRepositoryToken(TransactionsEntity),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('/POST create transaction success', async () => {
    const dataForCreateTransaction: CreateTransactionDto = {
      transactionExternalId: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      accountExternalIdDebit: '2d0d21ed-16fa-47ec-a0c1-fe532644d375',
      accountExternalIdCredit: '012dd5af-aac1-40fa-b7c2-7e657f44d7cf',
      tranferTypeId: 1,
      value: 1000,
      tranferTypeName: '',
    };
    const transactionCreated: TransactionDto = {
      transactionExternalId: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      transactionType: {
        id: 1,
        name: '',
      },
      transactionStatus: {
        name: 'pending',
      },
      value: 1000,
      createdAt: '2023-11-06T07:53:06.533Z',
      updatedAt: '2023-11-06T07:53:06.533Z',
    };
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn().mockReturnThis();
    const responseMock: Partial<Response> = {
      status: statusMock,
      json: jsonMock,
    };

    jest
      .spyOn(service, 'createTransaction')
      .mockResolvedValue(transactionCreated);

    const result = await controller.createTransaction(
      'traceId',
      dataForCreateTransaction,
      responseMock as Response,
    );

    expect(result).toBeDefined();
    expect(result.status).toHaveBeenCalledWith(200);
    expect(result.json).toHaveBeenCalledWith(transactionCreated);
  });

  it('/POST create transaction failed', async () => {
    const dataForCreateTransaction: CreateTransactionDto = {
      transactionExternalId: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      accountExternalIdDebit: '2d0d21ed-16fa-47ec-a0c1-fe532644d375',
      accountExternalIdCredit: '012dd5af-aac1-40fa-b7c2-7e657f44d7cf',
      tranferTypeId: 1,
      value: 1000,
      tranferTypeName: '',
    };
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn().mockReturnThis();
    const responseMock: Partial<Response> = {
      status: statusMock,
      json: jsonMock,
    };

    jest
      .spyOn(service, 'createTransaction')
      .mockRejectedValue(new Error('Error Test'));

    const result = await controller.createTransaction(
      'traceId',
      dataForCreateTransaction,
      responseMock as Response,
    );

    expect(result).toBeDefined();
    expect(result.status).toHaveBeenCalledWith(500);
    expect(result.json).toHaveBeenCalledWith([
      {
        message: 'Error Test',
        origin:
          'TRANSACTIONS_CHALLENGE_TRANSACTIONSCONTROLLER_CREATE_TRANSACTION',
        trace_id: 'traceId',
      },
    ]);
  });

  it('/GET get transaction success', async () => {
    const transactionCreated: TransactionDto = {
      transactionExternalId: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      transactionType: {
        id: 1,
        name: '',
      },
      transactionStatus: {
        name: 'pending',
      },
      value: 1000,
      createdAt: '2023-11-06T07:53:06.533Z',
      updatedAt: '2023-11-06T07:53:06.533Z',
    };
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn().mockReturnThis();
    const responseMock: Partial<Response> = {
      status: statusMock,
      json: jsonMock,
    };

    jest
      .spyOn(service, 'getTransactionByExternalId')
      .mockResolvedValue(transactionCreated);

    const result = await controller.getTransactionByExternalId(
      'traceId',
      'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      responseMock as Response,
    );

    expect(result).toBeDefined();
    expect(result.status).toHaveBeenCalledWith(200);
    expect(result.json).toHaveBeenCalledWith(transactionCreated);
  });

  it('/GET get transaction failed', async () => {
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn().mockReturnThis();
    const responseMock: Partial<Response> = {
      status: statusMock,
      json: jsonMock,
    };

    jest
      .spyOn(service, 'getTransactionByExternalId')
      .mockRejectedValue(new Error('Error Test'));

    const result = await controller.getTransactionByExternalId(
      'traceId',
      'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      responseMock as Response,
    );

    expect(result).toBeDefined();
    expect(result.status).toHaveBeenCalledWith(500);
    expect(result.json).toHaveBeenCalledWith([
      {
        message: 'Error Test',
        origin:
          'TRANSACTIONS_CHALLENGE_TRANSACTIONSCONTROLLER_GET_TRANSACTION_BY_EXTERNAL_ID',
        trace_id: 'traceId',
      },
    ]);
  });

  it('MessagePattern receive transaction status from fraud validation topic', async () => {
    const kafkaContext = {
      getMessage: jest.fn().mockResolvedValue({
        value: {
          transactionExternalId: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
          transactionStatus: 'approved',
        },
      }),
      getTopic: jest.fn().mockReturnValue('fraud_status_transaction_topic'),
      getPartition: jest.fn().mockReturnValue(0),
      getArgs: jest.fn().mockReturnValue([]),
      getArgByIndex: jest.fn().mockReturnValue({}),
      args: [],
    } as unknown as KafkaContext;
    const databaseMock = {
      transaction_external_id: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      transaction_type_id: 1,
      transaction_type_name: '',
      transaction_status: 'pending',
      value: 1000,
    };
    const transactionOnDatabase: TransactionsEntity = new TransactionsEntity();
    transactionOnDatabase.id = 1;
    transactionOnDatabase.transaction_external_id =
      databaseMock.transaction_external_id;
    transactionOnDatabase.transaction_type_id =
      databaseMock.transaction_type_id;
    transactionOnDatabase.transaction_type_name =
      databaseMock.transaction_type_name;
    transactionOnDatabase.transaction_status = databaseMock.transaction_status;
    transactionOnDatabase.value = databaseMock.value;
    transactionOnDatabase.created_at = '2023-11-06T07:53:06.533Z';
    transactionOnDatabase.updated_at = '2023-11-06T07:53:06.533Z';

    const serviceReceiveMessageSpy = jest.spyOn(
      service,
      'readFraudStatusTransactionTopicAndUpdateOnDatabase',
    );

    const findOneSpy = jest
      .spyOn(transactionsRepository, 'findOneOrFail')
      .mockResolvedValue(transactionOnDatabase);

    const updateSpy = jest.spyOn(transactionsRepository, 'update');

    await controller.readFraudStatusTransactionTopicAndUpdateOnDatabase(
      kafkaContext,
    );

    expect(serviceReceiveMessageSpy).toHaveBeenCalledWith(
      'fraud_status_transaction_topic',
      kafkaContext,
    );
    expect(findOneSpy).toHaveBeenCalledWith({
      transaction_external_id: databaseMock.transaction_external_id,
    });
    expect(updateSpy).toHaveBeenCalledWith(1, {
      transaction_status: 'approved',
    });
  });
});
