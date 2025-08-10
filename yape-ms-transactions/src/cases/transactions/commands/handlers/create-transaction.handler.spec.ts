import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';

const mockedUUID = 'f86b2d33-62b2-45c3-9091-07137184bf85';

/* Project */
import { CreateTransactionHandler } from './create-transaction.handler';
import { CreateTransactionCommand } from '../impl/create-transaction.command';
import { CreateTransactionDto } from '../../dtos';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../repositories';
import { Transaction } from '../../models';
import { RetrieveTransactionTypeQuery } from '../../../transaction_types/queries';
import { TransactionType } from '../../../transaction_types/models';
import { KafkaService } from '../../../../common/kafka/kafka.service';
import { validateDTOClass } from '../../../../common/helpers';
import { TRANSACTION_TYPE_NOT_FOUND } from '../../../../common/constants/errors';

jest.mock('../../../../common/helpers', () => ({
  validateDTOClass: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue(mockedUUID),
}));

const mockedValidate = validateDTOClass as jest.MockedFunction<
  typeof validateDTOClass
>;

const sampleDto: CreateTransactionDto = {
  value: 123.45,
  accountExternalIdDebit: '550e8400-e29b-41d4-a716-446655440000',
  accountExternalIdCredit: '550e8400-e29b-41d4-a716-446655440001',
  transferTypeId: 2,
};

const sampleType: TransactionType = { id: 2, name: 'WITHDRAWAL' };

const createdTransaction: Transaction = {
  id: mockedUUID,
  accountExternalIdDebit: sampleDto.accountExternalIdDebit,
  accountExternalIdCredit: sampleDto.accountExternalIdCredit,
  transferTypeId: sampleDto.transferTypeId,
  value: String(sampleDto.value),
  transactionStatusName: 'pending',
  createdAt: new Date('2023-01-01T10:00:00.000Z'),
  updatedAt: new Date('2023-01-01T10:00:00.000Z'),
  deletedAt: null,
};

describe('CreateTransactionHandler', () => {
  let createTransactionHandler: CreateTransactionHandler;
  let transactionRepo: jest.Mocked<ITransactionRepository>;
  let kafkaService: jest.Mocked<KafkaService>;
  let queryBus: { execute: jest.Mock };

  beforeEach(async () => {
    transactionRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatusById: jest.fn(),
    } as jest.Mocked<ITransactionRepository>;

    queryBus = { execute: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateTransactionHandler,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('topic-transactions'),
          },
        },
        { provide: QueryBus, useValue: queryBus },
        { provide: TRANSACTION_REPOSITORY, useValue: transactionRepo },
        {
          provide: KafkaService,
          useValue: {
            publishToTopic: jest.fn().mockResolvedValue(undefined),
            onModuleInit: jest.fn(),
            onApplicationBootstrap: jest.fn(),
            onApplicationShutdown: jest.fn(),
            registerListener: jest.fn(),
          },
        },
      ],
    }).compile();

    createTransactionHandler = moduleRef.get(CreateTransactionHandler);
    kafkaService = moduleRef.get(KafkaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createTransactionHandler).toBeDefined();
    expect(transactionRepo).toBeDefined();
    expect(queryBus).toBeDefined();
    expect(kafkaService).toBeDefined();
  });

  it('should create a transaction, publish to Kafka and return mapped response', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);
    queryBus.execute.mockResolvedValueOnce(sampleType);
    transactionRepo.save.mockResolvedValueOnce(createdTransaction);

    const result = await createTransactionHandler.execute(
      new CreateTransactionCommand(sampleDto),
    );

    expect(mockedValidate).toHaveBeenCalledWith(
      CreateTransactionDto,
      sampleDto,
      'Invalid transaction payload',
    );

    expect(queryBus.execute).toHaveBeenCalledTimes(1);

    const calledArg = queryBus.execute.mock.calls[0][0];
    expect(calledArg).toBeInstanceOf(RetrieveTransactionTypeQuery);
    expect(calledArg.id).toBe(sampleDto.transferTypeId);

    expect(transactionRepo.save).toHaveBeenCalledTimes(1);
    expect(transactionRepo.save).toHaveBeenCalledWith({
      id: mockedUUID,
      accountExternalIdDebit: sampleDto.accountExternalIdDebit,
      accountExternalIdCredit: sampleDto.accountExternalIdCredit,
      transferTypeId: sampleDto.transferTypeId,
      value: String(sampleDto.value),
    });

    expect(kafkaService.publishToTopic).toHaveBeenCalledTimes(1);
    expect(kafkaService.publishToTopic).toHaveBeenCalledWith(
      'topic-transactions',
      JSON.stringify(createdTransaction),
    );

    expect(result).toEqual({
      transactionId: createdTransaction.id,
      transactionType: { name: sampleType.name },
      transactionStatus: { name: createdTransaction.transactionStatusName },
      value: Number(createdTransaction.value),
      createdAt: createdTransaction.createdAt.toISOString(),
    });
  });

  it('should throw when dto validation returns an error', async () => {
    const error = new Error('Invalid transaction payload');
    mockedValidate.mockResolvedValueOnce(error);

    await expect(
      createTransactionHandler.execute(new CreateTransactionCommand(sampleDto)),
    ).rejects.toThrow(error.message);

    expect(queryBus.execute).not.toHaveBeenCalled();
    expect(transactionRepo.save).not.toHaveBeenCalled();
    expect(kafkaService.publishToTopic).not.toHaveBeenCalled();
  });

  it('should throw TRANSACTION_TYPE_NOT_FOUND when type is missing', async () => {
    mockedValidate.mockResolvedValueOnce(sampleDto);
    queryBus.execute.mockResolvedValueOnce(null);

    await expect(
      createTransactionHandler.execute(new CreateTransactionCommand(sampleDto)),
    ).rejects.toEqual(TRANSACTION_TYPE_NOT_FOUND);

    expect(transactionRepo.save).not.toHaveBeenCalled();
    expect(kafkaService.publishToTopic).not.toHaveBeenCalled();
  });
});
