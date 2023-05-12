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

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return approved decision', () => {
      const transaction = {
        accountExternalIdDebit: '12345',
        accountExternalIdCredit: '12345',
        transactionTypeId: 1,
        transactionStatusId: 2,
        value: 120,
        transactionExternalId: 'e3f8e0d6-89a8-4314-866c-4420d10fb8ed',
        createdAt: '2023-05-13T00:03:17.931Z',
        updatedAt: '2023-05-13T00:03:17.931Z',
      };
      expect(appController.evaluateTransaction(transaction)).toBe(
        JSON.stringify({
          transactionExternalId: 'e3f8e0d6-89a8-4314-866c-4420d10fb8ed',
          transactionStatus: {
            name: 'approved',
          },
        }),
      );
    });

    it('should return rejected decision', () => {
      const transaction = {
        accountExternalIdDebit: '12345',
        accountExternalIdCredit: '12345',
        transactionTypeId: 1,
        transactionStatusId: 2,
        value: 1200,
        transactionExternalId: 'e3f8e0d6-89a8-4314-866c-4420d10fb8ed',
        createdAt: '2023-05-13T00:03:17.931Z',
        updatedAt: '2023-05-13T00:03:17.931Z',
      };
      expect(appController.evaluateTransaction(transaction)).toBe(
        JSON.stringify({
          transactionExternalId: 'e3f8e0d6-89a8-4314-866c-4420d10fb8ed',
          transactionStatus: {
            name: 'rejected',
          },
        }),
      );
    });
  });
});
