import { Test, TestingModule } from '@nestjs/testing';
import { ValidateTransactionController } from './validate-transaction.controller';
import { ValidateTransactionService } from './validate-transaction.service';

describe('ValidateTransactionController', () => {
  let controller: ValidateTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidateTransactionController],
      providers: [ValidateTransactionService],
    }).compile();

    controller = module.get<ValidateTransactionController>(ValidateTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
