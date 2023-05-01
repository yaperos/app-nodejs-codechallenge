import { Test, TestingModule } from '@nestjs/testing';
import { GearsService } from './gears.service';

describe('GearsService', () => {
  let service: GearsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GearsService],
    }).compile();

    service = module.get<GearsService>(GearsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
