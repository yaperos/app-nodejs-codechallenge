import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { TransactionCreatedResponse } from '../../application/dtos/transaction-created.dto';
import { TransactionApplication } from '../../application/transaction.application';
import { Transaction, TransactionProps } from '../../domain/transaction';
import { TransactionCreateDto } from './dtos/transaction-create.dto';
import { TransactionController } from './transaction.controller';

describe('TransactionController', () => {
  let controller: TransactionController;
  let application: TransactionApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionApplication, useValue: { save: () => {} } },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    application = module.get<TransactionApplication>(TransactionApplication);
  });

  it('should create a transaction', async () => {
    const transactionCreateDto = new TransactionCreateDto();
    transactionCreateDto.accountExternalIdCredit =
      'd28beff0-c093-48a7-b88c-59458ec74d1c';
    transactionCreateDto.accountExternalIdDebit =
      'd28beff0-c093-48a7-b88c-59458ec74d1c';
    transactionCreateDto.transferTypeId = 2;
    transactionCreateDto.value = 300;

    const transactionProps: TransactionProps = {
      ...transactionCreateDto,
      transactionId: uuidv4(),
    };
    const transaction = new Transaction(transactionProps);

    const response = new TransactionCreatedResponse();
    response.transactionId = transaction.properties.transactionId;
    response.status = transaction.properties.status;

    jest.spyOn(application, 'save').mockResolvedValue(response);
    const valueReturned = await controller.create(transactionCreateDto);

    expect(valueReturned.transactionId).toEqual(
      transaction.properties.transactionId,
    );
    expect(valueReturned.status).toEqual('PENDING');
  });
});
