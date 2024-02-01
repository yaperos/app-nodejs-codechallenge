import { Test, TestingModule } from '@nestjs/testing';
import { ApiAntifraudService } from './api-antifraud.service';

describe('ApiAntifraudService', () => {
  let service: ApiAntifraudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiAntifraudService],
    }).compile();

    service = module.get<ApiAntifraudService>(ApiAntifraudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
