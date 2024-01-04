import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudeService } from './anti-fraude.service';

describe('AntiFraudeService', () => {
  let service: AntiFraudeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntiFraudeService],
    }).compile();

    service = module.get<AntiFraudeService>(AntiFraudeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
