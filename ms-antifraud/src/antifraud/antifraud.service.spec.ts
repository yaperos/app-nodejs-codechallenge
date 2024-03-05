import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudService } from './antifraud.service';

describe('AntifraudService', () => {
  let service: AntifraudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntifraudService],
    }).compile();

    service = module.get<AntifraudService>(AntifraudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
