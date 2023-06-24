import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsService } from './transactions.service';
import { KafkaService } from '../../kafka/services/kafka.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let configService: ConfigService;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
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

    service = module.get<TransactionsService>(TransactionsService);
    configService = module.get<ConfigService>(ConfigService);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it('onModuleInit should initialize the service constants', () => {
    service.onModuleInit();

    expect(configService.get).toBeCalledWith('MAX_TRANSACTION_VALUE');
    expect(configService.get).toBeCalledWith('APPROVE_TRANSACTION_EVENT');
    expect(configService.get).toBeCalledWith('REJECT_TRANSACTION_EVENT');
  });

  describe('sendValidationStatusEvent', () => {
    it('should emit the rejection event if the transaction value is greater than 1000', () => {
      const trxData = { id: 'trx-id', value: 1001 };

      service.sendValidationStatusEvent(trxData);

      expect(kafkaService.emitEvent).toBeCalledWith(
        configService.get('REJECT_TRANSACTION_EVENT'),
        {
          id: trxData.id,
        },
      );
    });

    it('should emit the approval event if the transaction value is less than 1000', () => {
      const trxData = { id: 'trx-id', value: 999 };

      service.sendValidationStatusEvent(trxData);

      expect(kafkaService.emitEvent).toBeCalledWith(
        configService.get('APPROVE_TRANSACTION_EVENT'),
        {
          id: trxData.id,
        },
      );
    });
  });
});
