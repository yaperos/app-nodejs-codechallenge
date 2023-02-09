import { CACHE_MANAGER } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Transaction } from '../../database/entities';
import { TransactionStatus, TransactionType } from './../../database/entities';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let clientKafka: ClientKafka;
  let cacheService: unknown;
  let transactionRepository: unknown;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'YAPE_SERVICE',
          useValue: {
            connect: jest.fn(),
            send: jest.fn(),
            subscribeToResponseOf: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest
              .fn()
              .mockResolvedValueOnce(null)
              .mockResolvedValueOnce(
                JSON.stringify({
                  id: 1,
                }),
              ),
            set: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue({
              id: 1,
            }),
            find: jest.fn().mockResolvedValue([]),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue({
              id: 1,
            }),
          }),
        },
        {
          provide: getRepositoryToken(TransactionType),
          useFactory: () => ({
            findOne: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
          }),
        },
        {
          provide: getRepositoryToken(TransactionStatus),
          useFactory: () => ({
            findOne: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    clientKafka = module.get<ClientKafka>('YAPE_SERVICE');
    cacheService = module.get<Cache>(CACHE_MANAGER);
    module.get(getRepositoryToken(Transaction));
    module.get(getRepositoryToken(TransactionType));
    module.get(getRepositoryToken(TransactionStatus));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('onModuleInit should be called', () => {
    const onModuleInitSpy = jest.spyOn(service, 'onModuleInit');
    service.onModuleInit();
    expect(onModuleInitSpy).toHaveBeenCalled();
  });

  it('subscribeToResponseOf should be called', () => {
    const subscribeToResponseOfSpy = jest.spyOn(
      clientKafka,
      'subscribeToResponseOf',
    );
    service.onModuleInit();
    expect(subscribeToResponseOfSpy).toHaveBeenCalled();
  });

  it('connect should be called', () => {
    const connectSpy = jest.spyOn(clientKafka, 'connect');
    service.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('get a transaction and catch', async () => {
    const transactionExternalId = 'transactionExternalId';

    expect(await service.getTransaction(transactionExternalId)).toEqual({
      id: 1,
    });

    expect((cacheService as any).set).toHaveBeenCalled();

    expect(await service.getTransaction(transactionExternalId)).toEqual({
      id: 1,
    });

    expect((cacheService as any).set).toHaveBeenCalledTimes(1);
  });

  it('gets transactions', async () => {
    expect(await service.getTransactions()).toEqual([]);
  });

  it('gets transactions status from list', async () => {
    expect(await service.getTransactionStatusOfTransactionList([1, 2])).toEqual(
      [],
    );
  });

  it('getTransactionStatusFromBatch', async () => {
    expect(await service.getTransactionStatusFromBatch([1, 2])).toEqual([]);
  });

  it('gets transactions type from list', async () => {
    expect(await service.getTransactionTypeOfTransactionList([1, 2])).toEqual(
      [],
    );
  });

  it('getTransactionTypeFromBatch', async () => {
    expect(await service.getTransactionTypeFromBatch([1, 2])).toEqual([]);
  });

  it('update transaction status', async () => {
    expect(await service.updateTransactionStatus('some-guid', 2)).toEqual({
      id: 1,
    });
  });
});
