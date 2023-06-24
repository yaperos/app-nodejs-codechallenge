import { Test, TestingModule } from '@nestjs/testing';

import { TransactionStatus } from '../constants/enums';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../services/transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionController,
        {
          provide: TransactionService,
          useValue: {
            updateTransactionStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('approveTransaction should call the updateTransactionStatus service method with the status approved', () => {
    const trxUpdateEvent = { id: 'trx-id' };
    controller.approveTransaction(trxUpdateEvent);

    expect(service.updateTransactionStatus).toBeCalledWith(
      trxUpdateEvent.id,
      TransactionStatus.APPROVED,
    );
  });

  it('rejectTransaction should call the updateTransactionStatus service method with the status rejected', () => {
    const trxUpdateEvent = { id: 'trx-id' };
    controller.rejectTransaction(trxUpdateEvent);

    expect(service.updateTransactionStatus).toBeCalledWith(
      trxUpdateEvent.id,
      TransactionStatus.REJECTED,
    );
  });
});
