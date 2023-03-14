import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionStatus, TransactionType } from '../transaction';
import { SeedMock } from './seed.mock.spec';
import { SeedService } from './seed.service';

describe('SeedService', () => {
  let seedService: SeedService;
  const transactionStatusRepository = new SeedMock();
  const transactionTypeRepository = new SeedMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(TransactionStatus),
          useValue: transactionStatusRepository,
        },
        {
          provide: getRepositoryToken(TransactionType),
          useValue: transactionTypeRepository,
        },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(seedService).toBeDefined();
  });

  it('validate seeding in OnInitModule', async () => {
    const spyTransactionStatusRepositorySave = jest.spyOn(
      transactionStatusRepository,
      'save',
    );
    const spyTransactionTypeRepositorySave = jest.spyOn(
      transactionTypeRepository,
      'save',
    );

    await seedService.onModuleInit();
    expect(spyTransactionStatusRepositorySave).toHaveBeenCalledTimes(1);
    expect(spyTransactionTypeRepositorySave).toHaveBeenCalledTimes(1);
  });
});
