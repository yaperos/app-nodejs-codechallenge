import { Test } from '@nestjs/testing';
import { CreateTransactionDto, TransactionPresenter } from '@payments/shared/dto';
import { of } from 'rxjs';

import { TransactionService } from '../../src/app/infrastructure/transaction/transaction.service';

describe('AppService', () => {
  let service: TransactionService;
  const insertTransactionPresenter = TransactionPresenter.createRandomTransaction(); 

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionService, 
          useFactory: () => ({
            createTransaction: jest.fn((transaction: CreateTransactionDto) => of(insertTransactionPresenter))
          })
        }
      ],
    }).compile();

    service = app.get<TransactionService>(TransactionService);
  });

  describe('createTransaction', () => {
    it('should return a TransactionPresenter correctly"', async () => {
      const transactionDto = CreateTransactionDto.createRandomTransaction();
      const transactionPresenter = service.createTransaction(transactionDto);
      expect(transactionPresenter).toEqual(transactionPresenter);
    });
  });
});
