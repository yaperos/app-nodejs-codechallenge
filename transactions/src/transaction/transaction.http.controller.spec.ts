import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './repositories/transaction.repository';

import { TransactionHttpController } from './transaction.http.controller';
import { providersMock } from '../../test/mocks/providersMock';
import { INestApplication } from '@nestjs/common';
import { CreateTransferRepository } from './repositories/create-transaction-repository';
describe('TransactionHttpController', () => {
  let app: INestApplication;
  let controller: TransactionHttpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionHttpController],
      providers: [
        TransactionService,
        TransactionRepository,
        CreateTransferRepository,
        ...providersMock(),
      ],
    }).compile();

    controller = module.get<TransactionHttpController>(
      TransactionHttpController,
    );
  });

  it('should transaction controller be defined', () => {
    expect(controller).toBeDefined();
  });
  //it('Should send bad request when post data is incorrect', async () => {});
});
