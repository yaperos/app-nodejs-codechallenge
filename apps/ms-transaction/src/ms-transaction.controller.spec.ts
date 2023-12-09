import { Test, TestingModule } from '@nestjs/testing';
import { MsTransactionController } from './ms-transaction.controller';
import { MsTransactionService } from './ms-transaction.service';

describe('MsTransactionController', () => {
  let msTransactionController: MsTransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsTransactionController],
      providers: [MsTransactionService],
    }).compile();

    msTransactionController = app.get<MsTransactionController>(MsTransactionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msTransactionController.getHello()).toBe('Hello World!');
    });
  });
});
