import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { environment } from '@core/config/environment';
import { RedisCacheService } from '@core/cache';
import {
  AntifraudPattern,
  TransactionStatusEnum,
  TransactionStatusId,
} from '@core/config/constants';
import { TransactionService } from './transaction.service';
import { TransactionMock } from './transaction.mock.spec';
import { Transaction, TransactionType } from './entities';
import { RedisCacheMock } from '@core/cache/redis.mock.spec';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  const transactionMock = new TransactionMock();
  const redisCacheMock = new RedisCacheMock();
  const transactionExternalId = TransactionMock.transactionExternalId;
  const updateTransactionDto = TransactionMock.updateTransactionDto;
  const createTransactionDto = TransactionMock.createTransactionDto;
  const transactionType = TransactionMock.transactionType;
  const transaction = TransactionMock.transaction;
  const listTransactions = TransactionMock.listTransactions;
  const pageOptionsDto = TransactionMock.pageOptionsDto;
  const itemCount = 30;

  beforeEach(async () => {
    environment.antifraudKafkaConfig.name =
      TransactionMock.antifraudKafkaConfigName;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionMock.antifraudKafkaConfigName,
          useValue: transactionMock,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: transactionMock,
        },
        {
          provide: getRepositoryToken(TransactionType),
          useValue: transactionMock,
        },
        {
          provide: RedisCacheService,
          useValue: redisCacheMock,
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  it('createTransaction should be return a transaction created', async () => {
    const spyFindTypeTransaction = jest
      .spyOn(
        transactionService, //@ts-ignore
        'findTypeTransaction',
      ) //@ts-ignore
      .mockReturnValueOnce(transactionType);

    const spySave = jest
      .spyOn(transactionMock, 'save')
      .mockReturnValueOnce(transaction);

    const spyEmit = jest
      .spyOn(transactionMock, 'emit')
      .mockReturnValueOnce(of(null));

    const spySaveToRedis = jest
      .spyOn(redisCacheMock, 'saveTransaction')
      .mockReturnValueOnce(null);

    const dataTransaction = await transactionService.createTransaction(
      createTransactionDto,
    );

    expect(spySave).toHaveBeenCalledWith({
      accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
      accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
      value: createTransactionDto.value,
      transactionType,
      transactionStatus: {
        id: TransactionStatusId[TransactionStatusEnum.PENDING],
        name: TransactionStatusEnum.PENDING,
      },
    });

    expect(spyFindTypeTransaction).toHaveBeenCalledWith(
      createTransactionDto.tranferTypeId,
    );

    expect(spySaveToRedis).toHaveBeenCalledWith(
      transaction.transactionExternalId,
      transaction,
    );

    expect(spyEmit).toHaveBeenCalledWith(
      AntifraudPattern.VALIDATE_ANTIFRAUD,
      JSON.stringify({
        ...transaction,
        transactionExternalId: transaction.transactionExternalId,
      }),
    );

    expect(dataTransaction).toBeDefined();
  });

  it('findTypeTransaction should be return a transactionType', async () => {
    const spyFindOne = jest
      .spyOn(transactionMock, 'findOne')
      .mockReturnValueOnce(transactionType);

    const transactionTypeResponse = //@ts-ignore
      await transactionService.findTypeTransaction(
        createTransactionDto.tranferTypeId,
      );

    expect(transactionTypeResponse).toBeDefined();
    expect(spyFindOne).toHaveBeenCalledWith({
      where: { id: createTransactionDto.tranferTypeId },
    });
  });

  it('getAllTransactions should be return a listTransactions', async () => {
    const spyFind = jest
      .spyOn(transactionMock, 'findAndCount')
      .mockReturnValueOnce([listTransactions, itemCount]);

    await transactionService.getAllTransactions(pageOptionsDto);

    expect(spyFind).toHaveBeenCalledWith({
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: {
        transactionStatus: true,
        transactionType: true,
      },
    });
  });

  it('findOne should return a transaction of redis cache', async () => {
    const spyRedisGetTransaction = jest
      .spyOn(redisCacheMock, 'getTransaction')
      .mockReturnValueOnce(transaction);
    const spyFindOneOrFail = jest.spyOn(transactionMock, 'findOneOrFail');
    const responseTransactionOfRedis = await transactionService.findOne(
      transactionExternalId,
    );
    expect(spyRedisGetTransaction).toHaveBeenCalledWith(transactionExternalId);
    expect(spyFindOneOrFail).not.toHaveBeenCalled();
    expect(responseTransactionOfRedis).toEqual(JSON.stringify(transaction));
  });

  it('findAll should return a transaction of database', async () => {
    const spyFindOneOrFail = jest
      .spyOn(transactionMock, 'findOneOrFail')
      .mockReturnValueOnce(transaction);
    const spyRedisGetTransaction = jest
      .spyOn(redisCacheMock, 'getTransaction')
      .mockReturnValueOnce(null);
    const responseTransactionOfDatabase = await transactionService.findOne(
      transactionExternalId,
    );

    expect(spyRedisGetTransaction).toHaveBeenCalledWith(transactionExternalId);
    expect(spyFindOneOrFail).toHaveBeenCalled();
    expect(responseTransactionOfDatabase).toEqual(JSON.stringify(transaction));
  });

  it('rejectedTransaction should update transaction with status REJECTED', async () => {
    const spyUpdate = jest.spyOn(transactionMock, 'update');
    const spySaveTransactionToCache = jest.spyOn(
      transactionService, //@ts-ignore
      'saveTransactionToCache',
    );

    await transactionService.rejectedTransaction(updateTransactionDto);
    expect(spyUpdate).toHaveBeenCalledWith(
      {
        transactionExternalId: updateTransactionDto.transactionExternalId,
      },
      {
        transactionStatus: {
          id: TransactionStatusId[TransactionStatusEnum.REJECTED],
        },
      },
    );
    expect(spySaveTransactionToCache).toHaveBeenCalledWith(
      updateTransactionDto.transactionExternalId,
      TransactionStatusEnum.REJECTED,
    );
  });

  it('approvedTransaction should update transaction with status APPROVED', async () => {
    const spyUpdate = jest.spyOn(transactionMock, 'update');
    const spySaveTransactionToCache = jest.spyOn(
      transactionService, //@ts-ignore
      'saveTransactionToCache',
    );

    await transactionService.approvedTransaction(updateTransactionDto);
    expect(spyUpdate).toHaveBeenCalledWith(
      {
        transactionExternalId: updateTransactionDto.transactionExternalId,
      },
      {
        transactionStatus: {
          id: TransactionStatusId[TransactionStatusEnum.APPROVED],
        },
      },
    );
    expect(spySaveTransactionToCache).toHaveBeenCalledWith(
      updateTransactionDto.transactionExternalId,
      TransactionStatusEnum.APPROVED,
    );
  });
});
