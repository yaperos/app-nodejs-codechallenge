import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../services/transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  const mockTransaction = {
    transactionExternalId: "b6fbf1d1-a35a-4952-bf64-f8dee9238c0e",
    transactionType: {
        name: 3
    },
    transactionStatus: {
        name: "approved"
    },
    value: 678,
    createdAt: "2023-02-08T19:51:45.027Z"
}
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{
        provide: TransactionsService,
        useValue: {
          findOne: jest.fn().mockResolvedValue(mockTransaction),
          create: jest.fn().mockResolvedValue(mockTransaction),
        }
      }],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get transaction', async () => {
    await expect(controller.getTransaction('b6fbf1d1-a35a-4952-bf64-f8dee9238c0e'))
      .resolves.toEqual(mockTransaction);
  });

  it('should create transaction', async () => {
    const mockData = {
      accountExternalIdDebit: "07261b14-7db4-444d-9373-898a7abb1f08",
      accountExternalIdCredit: "a7eefd9a-36b9-4393-b967-e7999a923b3e",
      tranferTypeId: 3,
      value: 678
    };

    await expect(controller.create(mockData)).resolves.toEqual(mockTransaction);
  });
});
