import { Test, TestingModule } from '@nestjs/testing';

/* Project */
import { AntiFraudService } from './anti-fraud.service';

describe('AntiFraudService', () => {
  let service: AntiFraudService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntiFraudService],
    }).compile();

    service = module.get<AntiFraudService>(AntiFraudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('ping should return "pong"', () => {
    expect(service.ping()).toBe('pong');
  });
});
