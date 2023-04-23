import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudReceiverService } from './anti-fraud-receiver.service';

describe('AntiFraudReceiverService', () => {
  let service: AntiFraudReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntiFraudReceiverService],
    }).compile();

    service = module.get<AntiFraudReceiverService>(AntiFraudReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
