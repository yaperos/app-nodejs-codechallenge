import { Test } from '@nestjs/testing';
import { CreateTransactionDto } from '@payments/shared/dto';
import { lastValueFrom } from 'rxjs';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('createTransaction', () => {
    it('should return a transactionPresenter correctly"', async () => {
      const createTransactionDto = new CreateTransactionDto();
      createTransactionDto.accountExternalIdCredit = crypto.randomUUID();
      createTransactionDto.accountExternalIdDebit = crypto.randomUUID();
      createTransactionDto.transferTypeId = 1;
      createTransactionDto.value = 200;
      const transactionPresenter = await lastValueFrom(service.createTransaction(createTransactionDto));
      console.log(transactionPresenter);
      expect(transactionPresenter).toEqual(transactionPresenter);
    });
  });
});
