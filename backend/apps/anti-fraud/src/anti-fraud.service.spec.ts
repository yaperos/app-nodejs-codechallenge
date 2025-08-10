import { faker } from '@faker-js/faker';
import { TransactionStatusEnum } from '@shared/contracts';
import { KafkaProducer } from '@shared/messaging/messaging-kafka';

import { AntiFraudService } from './anti-fraud.service';

describe('AntiFraudService', () => {
  let service: AntiFraudService;
  let producer: KafkaProducer;

  beforeEach(() => {
    producer = { publish: jest.fn().mockResolvedValue(undefined) } as unknown as KafkaProducer;
    service = new AntiFraudService(producer);
  });

  describe('evaluateAndPublish', () => {
    it('rejects when value > 1000', async () => {
      const value = faker.number.int({ min: 1001, max: 10000 });
      const transactionExternalId = faker.string.uuid();

      await service.evaluateAndPublish(transactionExternalId, value);
  
      expect(producer.publish).toHaveBeenCalledWith(
        expect.any(String),
        transactionExternalId,
        { transactionExternalId, transactionStatus: TransactionStatusEnum.REJECTED },
      );
    });

    it('approves when value <= 1000', async () => {
      const value = faker.number.int({ min: 1, max: 1000 });
      const transactionExternalId = faker.string.uuid();

      await service.evaluateAndPublish(transactionExternalId, value);

      expect(producer.publish).toHaveBeenCalledWith(
        expect.any(String),
        transactionExternalId,
        { transactionExternalId, transactionStatus: TransactionStatusEnum.APPROVED },
      );
    });
  });
});