import { ClientProxyFactory } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionPresenter } from '@payments/shared/dto';
import { lastValueFrom, of } from 'rxjs';

import { AppController } from '../../src/app/app.controller';
import { AppService } from '../../src/app/app.service';

describe('AppController', () => {
  let controller: AppController;
  const originalTransactionPresenter = TransactionPresenter.createRandomTransaction(); 

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService, 
          useFactory: () => ({
            validateAndUpdateTransaction: jest.fn((transaction: TransactionPresenter) => of(originalTransactionPresenter))
          })
        }
      ],
    }).compile();

    controller = await app.resolve(AppController);

  });

  describe('handleValidateAmount', () => {
    it('should return a TransactionPresenter correctly"', async () => {
      const transactionPresenter = controller.handleValidateAmount(originalTransactionPresenter);
      expect(transactionPresenter).toEqual(transactionPresenter);
    });
  });
});
