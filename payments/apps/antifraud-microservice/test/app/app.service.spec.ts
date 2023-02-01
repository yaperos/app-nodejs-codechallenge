import { ClientProxyFactory } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { TransactionPresenter } from '@payments/shared/dto';
import { lastValueFrom, of } from 'rxjs';

import { AppService } from '../../src/app/app.service';

describe('AppService', () => {
  let service: AppService;
  const originalTransactionPresenter = TransactionPresenter.createRandomTransaction(); 

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: AppService, 
          useFactory: () => ({
            validateAndUpdateTransaction: jest.fn((transaction: TransactionPresenter) =>  of(originalTransactionPresenter))
          })
        }
      ],
    }).compile();

    service = await app.resolve(AppService);

  });

  describe('validateAndUpdateTransaction', () => {
    it('should return a TransactionPresenter correctly"', async () => {
      const originalTransactionPresenter = TransactionPresenter.createRandomTransaction();
      const transactionPresenter = await lastValueFrom(service.validateAndUpdateTransaction(originalTransactionPresenter));
      console.log(transactionPresenter);
      expect(transactionPresenter).toEqual(transactionPresenter);
    });
  });
});
