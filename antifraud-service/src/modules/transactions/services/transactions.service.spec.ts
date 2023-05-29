import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService, TransactionStatus } from './transactions.service';
import { KafkaProducerService } from 'src/adapters/externalServices/kafka/kafka.producer.service';

jest.mock('src/adapters/externalServices/kafka/kafka.producer.service');

class KafkaProducerServiceMock {
  async produce(payload: any) {
    return Promise.resolve(payload);
  }
}

describe('TransactionsService', () => {
  let service: TransactionsService;
  let kafkaProducerService: KafkaProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: KafkaProducerService,
          useClass: KafkaProducerServiceMock,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    kafkaProducerService =
      module.get<KafkaProducerService>(KafkaProducerService);
  });

  describe('rejectTransaction', () => {
    it('should send transaction to Kafka with REJECTED status', async () => {
      const produceSpy = jest.spyOn(kafkaProducerService, 'produce');
      const transactionId = '12345';

      await service.rejectTransaction(transactionId);

      expect(produceSpy).toHaveBeenCalledWith({
        messages: [
          {
            value: JSON.stringify({
              transactionId,
              status: TransactionStatus.REJECTED,
            }),
          },
        ],
      });
    });
  });

  describe('approveTransaction', () => {
    it('should send transaction to Kafka with APPROVED status', async () => {
      const produceSpy = jest.spyOn(kafkaProducerService, 'produce');
      const transactionId = '67890';

      await service.approveTransaction(transactionId);

      expect(produceSpy).toHaveBeenCalledWith({
        messages: [
          {
            value: JSON.stringify({
              transactionId,
              status: TransactionStatus.APPROVED,
            }),
          },
        ],
      });
    });
  });
});
