import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus } from '@prisma/client';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountExternalIdDebit: '123456',
        accountExternalIdCredit: '789012',
        tranferTypeId: 1,
        value: 100,
      };

      const createdTransaction = {
        id: 1,
        status: TransactionStatus.PENDING,
        ...createTransactionDto,
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(createdTransaction);

      expect(await controller.create(createTransactionDto)).toBe(
        createdTransaction,
      );
    });
  });

  // Test other methods similarly
});
