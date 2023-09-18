import { Test, TestingModule } from '@nestjs/testing';
import { DataupdateService } from './dataupdate.service';

describe('DataupdateService', () => {
  let service: DataupdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataupdateService],
    }).compile();

    service = module.get<DataupdateService>(DataupdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
