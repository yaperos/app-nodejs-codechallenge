import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TransactionsService } from './transactions.service';
import { TransactionsEntity } from '@entities/transactions.entity';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { API_NAME } from '@config/app';
import { KafkaService } from '@shared/kafka/kafka.service';
import { CreateTransactionDto, TransactionDto } from './transactions.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepository: Repository<TransactionsEntity>;
  let kafkaService: KafkaService;
  let kafkaClient: ClientKafka;

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

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<Repository<TransactionsEntity>>(
      getRepositoryToken(TransactionsEntity),
    );
    kafkaService = module.get<KafkaService>(KafkaService);
    kafkaClient = module.get<ClientKafka>(API_NAME);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(transactionsRepository).toBeDefined();
    expect(kafkaService).toBeDefined();
  });

  it('create transaction success', async () => {
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

    const databaseSpy = jest
      .spyOn(transactionsRepository, 'save')
      .mockResolvedValue(transactionOnDatabase);

    const kafkaSpy = jest.spyOn(
      kafkaService,
      'sendTransactionToFraudValidationTopic',
    );

    const kafkaClientSpy = jest.spyOn(kafkaClient, 'emit');

    const result = await service.createTransaction(dataForCreateTransaction);

    expect(result).toStrictEqual(transactionCreated);
    expect(databaseSpy).toHaveBeenCalledWith(databaseMock);
    expect(kafkaSpy).toHaveBeenCalledWith(
      'fraud_transaction_validation_topic',
      dataForCreateTransaction,
    );
    expect(kafkaClientSpy).toHaveBeenCalledWith(
      'fraud_transaction_validation_topic',
      { value: dataForCreateTransaction },
    );
  });

  it('create transaction rejected', async () => {
    const dataForCreateTransaction: CreateTransactionDto = {
      transactionExternalId: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      accountExternalIdDebit: '2d0d21ed-16fa-47ec-a0c1-fe532644d375',
      accountExternalIdCredit: '012dd5af-aac1-40fa-b7c2-7e657f44d7cf',
      tranferTypeId: 1,
      value: 2000,
      tranferTypeName: '',
    };
    const transactionCreated: TransactionDto = {
      transactionExternalId: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      transactionType: {
        id: 1,
        name: '',
      },
      transactionStatus: {
        name: 'rejected',
      },
      value: 2000,
      createdAt: '2023-11-06T07:53:06.533Z',
      updatedAt: '2023-11-06T07:53:06.533Z',
    };
    const databaseMock = {
      transaction_external_id: 'b8fbf989-cdea-4ad8-9279-8655c090c2ae',
      transaction_type_id: 1,
      transaction_type_name: '',
      transaction_status: 'rejected',
      value: 2000,
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

    const databaseSpy = jest
      .spyOn(transactionsRepository, 'save')
      .mockResolvedValue(transactionOnDatabase);

    const kafkaSpy = jest.spyOn(
      kafkaService,
      'sendTransactionToFraudValidationTopic',
    );

    const kafkaClientSpy = jest.spyOn(kafkaClient, 'emit');

    const result = await service.createTransaction(dataForCreateTransaction);

    expect(result).toStrictEqual(transactionCreated);
    expect(databaseSpy).toHaveBeenCalledWith(databaseMock);
    expect(kafkaSpy).toHaveBeenCalledTimes(0);
    expect(kafkaClientSpy).toHaveBeenCalledTimes(0);
  });

  it('get transaction success', async () => {
    const transactionExternalId = 'b8fbf989-cdea-4ad8-9279-8655c090c2ae';
    const transactionCreated: TransactionDto = {
      transactionExternalId,
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
    const databaseMock = {
      transaction_external_id: transactionExternalId,
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

    const databaseSpy = jest
      .spyOn(transactionsRepository, 'findOneOrFail')
      .mockResolvedValue(transactionOnDatabase);

    const result = await service.getTransactionByExternalId(
      transactionExternalId,
    );

    expect(result).toStrictEqual(transactionCreated);
    expect(databaseSpy).toHaveBeenCalledWith({
      transaction_external_id: transactionExternalId,
    });
  });
});
