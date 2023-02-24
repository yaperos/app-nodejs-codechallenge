import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudsService } from './anti-frauds.service';

describe('AntiFraudsService', () => {
  let service: AntiFraudsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntiFraudsService],
    }).compile();

    service = module.get<AntiFraudsService>(AntiFraudsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
