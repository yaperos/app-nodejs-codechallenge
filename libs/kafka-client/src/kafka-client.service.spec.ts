import { Test, TestingModule } from '@nestjs/testing';
import { KafkaClientService } from './kafka-client.service';

describe('KafkaClientService', () => {
  let service: KafkaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaClientService],
    }).compile();

    service = module.get<KafkaClientService>(KafkaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
