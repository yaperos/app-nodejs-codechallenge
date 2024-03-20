import { Test, TestingModule } from '@nestjs/testing';
import { KafkaConsumerService } from '../../src/infrastructure/services/kafka/consumer/kafka-consumer.service';

describe('KafkatService', () => {
  let service: KafkaConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaConsumerService],
    }).compile();

    service = module.get<KafkaConsumerService>(KafkaConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be undefined', () => {
    expect(service.onModuleDestroy()).toBeUndefined();
  });
});
