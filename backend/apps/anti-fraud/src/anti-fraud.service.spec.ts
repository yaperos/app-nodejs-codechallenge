import { faker } from '@faker-js/faker';
import { TransactionCommandTypeEnum, TransactionStatusEnum } from '@shared/contracts';
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
      const externalId = faker.string.uuid();

      await service.evaluateAndPublish(externalId, value);
  
      expect(producer.publish).toHaveBeenCalledWith(
        expect.any(String),
        externalId,
        { externalId, status: TransactionStatusEnum.REJECTED, type: TransactionCommandTypeEnum.VALIDATE_TRANSACTION },
      );
    });

    it('approves when value <= 1000', async () => {
      const value = faker.number.int({ min: 1, max: 1000 });
      const externalId = faker.string.uuid();

      await service.evaluateAndPublish(externalId, value);

      expect(producer.publish).toHaveBeenCalledWith(
        expect.any(String),
        externalId,
        { externalId, status: TransactionStatusEnum.APPROVED, type: TransactionCommandTypeEnum.VALIDATE_TRANSACTION },
      );
    });
  });
});