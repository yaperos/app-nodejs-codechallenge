import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../services/transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsController,
        {
          provide: TransactionsService,
          useValue: {
            sendValidationStatusEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('validateTransaction should call the correct transactions service method', () => {
    const trxData = { id: 'foo', value: 500 } as any;

    controller.validateTransaction(trxData);

    expect(service.sendValidationStatusEvent).toBeCalledWith(trxData);
  });
});
