import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudService } from '../../src/application/anti-fraud.service';
import { ConsumerInfrastructure } from '../../src/infrastructure/stream/consumer.infrastructure';
import { ProducerInfrastructure } from '../../src/infrastructure/stream/producer.infrastructure';
import { TransactionEvent } from '../../src/domain/entities/transaction.event';
import { topicTypes, transactionStatus } from '../../src/shared/constants';

describe('AntiFraudService', () => {
  let antiFraudService: AntiFraudService;
  let producerInfrastructure: ProducerInfrastructure;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: 'IConsumer',
          useClass: ConsumerInfrastructure,
        },
        {
          provide: 'IProducer',
          useClass: ProducerInfrastructure,
        },
      ],
    }).compile();

    antiFraudService = module.get<AntiFraudService>(AntiFraudService);
    producerInfrastructure = module.get<ProducerInfrastructure>('IProducer');
  });

  it('should be defined', () => {
    expect(antiFraudService).toBeDefined();
  });

  it('should validate amount as approved for value <= 1000', () => {
    const transaction: TransactionEvent = {
      value: 500,
      transactionStatus: { name: '' },
    } as TransactionEvent;

    const result = (antiFraudService as any).validateAmount(transaction);
    expect(result.transactionStatus.name).toBe(transactionStatus.approved);
  });

  it('should validate amount as rejected for value > 1000', () => {
    const transaction: TransactionEvent = {
      value: 1500,
      transactionStatus: { name: '' },
    } as TransactionEvent;

    const result = (antiFraudService as any).validateAmount(transaction);
    expect(result.transactionStatus.name).toBe(transactionStatus.rejected);
  });

  it('should publish transaction to approved topic', async () => {
    const transaction: TransactionEvent = {
      value: 500,
      transactionStatus: { name: transactionStatus.approved },
    } as TransactionEvent;

    producerInfrastructure.produce = jest.fn().mockResolvedValueOnce(null);
    await (antiFraudService as any).publishTransaction(transaction);
    expect(producerInfrastructure.produce).toHaveBeenCalledWith({
      topic: topicTypes.transactionApproved,
      messages: [
        {
          value: JSON.stringify(transaction),
        },
      ],
    });
  });

  it('should publish transaction to rejected topic', async () => {
    const transaction: TransactionEvent = {
      value: 1500,
      transactionStatus: { name: transactionStatus.rejected },
    } as TransactionEvent;

    producerInfrastructure.produce = jest.fn().mockResolvedValueOnce(null);
    await (antiFraudService as any).publishTransaction(transaction);
    expect(producerInfrastructure.produce).toHaveBeenCalledWith({
      topic: topicTypes.transactionRejected,
      messages: [
        {
          value: JSON.stringify(transaction),
        },
      ],
    });
  });
});
