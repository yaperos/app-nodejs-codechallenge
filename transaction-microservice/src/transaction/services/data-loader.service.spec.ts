import { Test, TestingModule } from '@nestjs/testing';
import { DataLoaderService } from './data-loader.service';

describe('DataLoaderService', () => {
  let service: DataLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataLoaderService],
    }).compile();

    service = module.get<DataLoaderService>(DataLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
