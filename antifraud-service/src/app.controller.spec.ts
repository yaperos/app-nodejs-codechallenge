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
    it('returns status approved', () => {
      expect(
        appController.verifyTransaction({
          transactionExternalId: 'a6b51090-1d43-447e-924f-0a4289f33cb5',
          accountExternalIdCredit: 'test',
          accountExternalIdDebit: 'test',
          transferTypeId: 1,
          value: 120,
        }),
      ).toBe(JSON.stringify({ status: 'approved' }));
    });
    it('returns status rejected"', () => {
      expect(
        appController.verifyTransaction({
          transactionExternalId: '433b9b02-f34d-47ff-aa24-79856941144c',
          accountExternalIdCredit: 'test',
          accountExternalIdDebit: 'test',
          transferTypeId: 1,
          value: 1001,
        }),
      ).toBe(JSON.stringify({ status: 'rejected' }));
    });
  });
});
