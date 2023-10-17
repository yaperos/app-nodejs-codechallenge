import { Test, TestingModule } from '@nestjs/testing';
import { CoreLibraryService } from './core-library.service';

describe('CoreLibraryService', () => {
  let service: CoreLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreLibraryService],
    }).compile();

    service = module.get<CoreLibraryService>(CoreLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
