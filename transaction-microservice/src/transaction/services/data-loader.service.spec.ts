import { Test, TestingModule } from '@nestjs/testing';
import * as DataLoader from 'dataloader';

import { DataLoaderService } from './data-loader.service';
import { TransactionService } from './transaction.service';

describe('DataLoaderService', () => {
  let service: DataLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataLoaderService,
        {
          provide: TransactionService,
          useValue: {
            getTransactionStatusFromBatch: jest.fn(),
            getTransactionTypeFromBatch: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DataLoaderService>(DataLoaderService);
    module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getLoaders should return dataloaders', () => {
    const loaders = service.getLoaders();
    expect(loaders).toEqual(
      expect.objectContaining({
        transactionStatusLoader: expect.any(DataLoader),
        transactionTypeLoader: expect.any(DataLoader),
      }),
    );
  });
});
