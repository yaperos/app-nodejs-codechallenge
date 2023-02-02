import { Test, TestingModule } from '@nestjs/testing';
import { YapeDomainService } from './yape-domain.service';

describe('YapeDomainService', () => {
  let service: YapeDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YapeDomainService],
    }).compile();

    service = module.get<YapeDomainService>(YapeDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
