import { Test, TestingModule } from '@nestjs/testing';
import { TransfertypesService } from './transfertypes.service';

describe('TransfertypesService', () => {
  let service: TransfertypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransfertypesService],
    }).compile();

    service = module.get<TransfertypesService>(TransfertypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
