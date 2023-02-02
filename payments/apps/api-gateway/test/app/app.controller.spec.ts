import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionDto, TransactionPresenter } from '@payments/shared/dto';
import { of } from 'rxjs';
import { TransactionController } from '../../src/app/infrastructure/transaction/transaction.controller';
import { TransactionService } from '../../src/app/infrastructure/transaction/transaction.service';

describe('AppController', () => {
  let controller: TransactionController;
  const insertTransactionPresenter = TransactionPresenter.createRandomTransaction(); 

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService, 
          useFactory: () => ({
            createTransaction: jest.fn((transaction: CreateTransactionDto) => of(insertTransactionPresenter))
          })
        }
      ],
    }).compile();

    controller = await app.resolve(TransactionController);

  });

  describe('createTransaction', () => {
    it('should return a TransactionPresenter correctly"', async () => {
      const transactionDto = CreateTransactionDto.createRandomTransaction();
      const transactionPresenter = controller.createTransaction(transactionDto);
      expect(transactionPresenter).toEqual(transactionPresenter);
    });
  });
});

