import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { TransactionService } from './transaction.service';
import { Transaction } from '../entities/Transaction.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from '../../kafka/services/kafka.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: Repository<Transaction>;
  let kafkaService: KafkaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
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
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
    kafkaService = module.get<KafkaService>(KafkaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('onModuleInit should initialize the service constants', () => {
    service.onModuleInit();
    expect(configService.get).toBeCalledWith('TRANSACTION_CREATE_EVENT');
  });
});
