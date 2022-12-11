import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudService } from './anti-fraud.service';

describe('AntiFraudService', () => {
  let service: AntiFraudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntiFraudService],
    }).compile();

    service = module.get<AntiFraudService>(AntiFraudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
