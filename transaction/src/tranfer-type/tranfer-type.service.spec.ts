import { Test, TestingModule } from '@nestjs/testing';
import { TranferTypeService } from './tranfer-type.service';

describe('TranferTypeService', () => {
  let service: TranferTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranferTypeService],
    }).compile();

    service = module.get<TranferTypeService>(TranferTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
