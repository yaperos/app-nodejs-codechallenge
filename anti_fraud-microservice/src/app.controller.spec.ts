import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('getNewTransaction', () => {
    it('should return a valid transaction', () => {
      const message = { transactionExternalId: '123', transactionValue: 999 };
      const result = appController.getNewTransaction(message);
      expect(result).toEqual({ transactionExternalId: '123', valid: true });
    });
    it('should return an invalid transaction', () => {
      const message = { transactionExternalId: '123', transactionValue: 1001 };
      const result = appController.getNewTransaction(message);
      expect(result).toEqual({ transactionExternalId: '123', valid: false });
    });
  });
});
