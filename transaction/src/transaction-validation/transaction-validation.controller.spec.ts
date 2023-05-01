import { Test, TestingModule } from '@nestjs/testing';
import { TransactionValidationController } from './transaction-validation.controller';
import { TransactionValidationService } from './transaction-validation.service';

describe('TransactionValidationController', () => {
  let controller: TransactionValidationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionValidationController],
      providers: [TransactionValidationService],
    }).compile();

    controller = module.get<TransactionValidationController>(TransactionValidationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
