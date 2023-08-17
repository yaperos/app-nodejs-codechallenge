import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { providersMock } from '../../test/mocks/providersMock';
import { CreateTransferRepository } from './repositories/create-transaction-repository';
describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        TransactionRepository,
        CreateTransferRepository,
        ...providersMock(),
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should transaction controller be defined', () => {
    expect(controller).toBeDefined();
  });
});
