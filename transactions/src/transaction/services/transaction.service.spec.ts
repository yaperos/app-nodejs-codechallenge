import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

import { TransactionService } from './transaction.service';
import { Transaction } from '../entities/Transaction.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from '../../kafka/services/kafka.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionStatus } from '../constants/enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: Repository<Transaction>;
  let kafkaService: KafkaService;
  let configService: ConfigService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            emitEvent: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((env) => env),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
    kafkaService = module.get<KafkaService>(KafkaService);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('onModuleInit should initialize the service constants', () => {
    service.onModuleInit();
    expect(configService.get).toBeCalledWith('TRANSACTION_CREATE_EVENT');
  });

  describe('findOneById', () => {
    it('findOneById should call the findOne repository method (and caching transaction data)', async () => {
      const trxMock = { id: 'trx-id', value: 5000 } as any;
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(trxMock);

      await service.findOneById('trx-id');

      expect(cacheManager.get).toBeCalledWith('trx-id');
      expect(transactionRepository.findOne).toBeCalledWith({
        where: { id: 'trx-id' },
        relations: ['transactionStatus', 'transferType'],
      });
      expect(cacheManager.set).toBeCalledWith(
        'trx-id',
        JSON.stringify(trxMock),
      );
    });

    it('findOneById should call the findOne repository method (and retrieve cached transaction data)', async () => {
      const trxMock = { id: 'trx-id', value: 5000 } as any;

      jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(JSON.stringify(trxMock));

      await service.findOneById('trx-id');

      expect(cacheManager.get).toBeCalledWith('trx-id');
      expect(transactionRepository.findOne).not.toBeCalled();
      expect(cacheManager.set).not.toBeCalled();
    });
  });

  it('createTransaction should call the correct transactionRepository methods', async () => {
    service.onModuleInit();
    jest
      .spyOn(transactionRepository, 'save')
      .mockResolvedValue({ id: 'trx-id', value: 5000 } as any);
    jest.spyOn(service, 'findOneById').mockResolvedValue({} as any);
    const transaction = { value: 5000 } as any;

    await service.createTransaction(transaction);

    expect(transactionRepository.save).toBeCalledWith({
      value: 5000,
      transactionStatusId: TransactionStatus.PENDING,
    });
    expect(kafkaService.emitEvent).toBeCalledWith(
      'TRANSACTION_CREATE_EVENT',
      JSON.stringify({ id: 'trx-id', value: 5000 }),
    );
    expect(service.findOneById).toBeCalledWith('trx-id');
  });

  it('updateTransactionStatus should call the update transactionRepository method and should invalidate cache', async () => {
    await service.updateTransactionStatus('trx-id', TransactionStatus.APPROVED);

    expect(transactionRepository.update).toBeCalledWith(
      { id: 'trx-id' },
      { transactionStatusId: TransactionStatus.APPROVED },
    );
    expect(cacheManager.del).toBeCalledWith('trx-id');
  });
});
