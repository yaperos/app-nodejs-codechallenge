import { Test, TestingModule } from '@nestjs/testing';
import { MsTransactionAsyncController } from '../src/ms-transaction.async.controller';
import { MsTransactionService } from '../src/ms-transaction.service';
import MaybeMockedDeep = jest.MaybeMockedDeep;
describe('TransactionAsyncController', () => {
  let controller: MsTransactionAsyncController;
  let service: MaybeMockedDeep<MsTransactionService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsTransactionAsyncController],
      providers: [
        {
          provide: MsTransactionService,
          useFactory: () => ({
            updateTransaction: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get(MsTransactionAsyncController);
    service = module.get(MsTransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('updateTransactionStatus', () => {
    it('should update the transaction status', async () => {
      const transactionStatus = {
        requestId: 'test-request-id',
        status: 'status-test',
      };
      await controller.updateTransactionStatus(transactionStatus);

      expect(service.updateTransaction).toBeCalledTimes(1);
      expect(service.updateTransaction).toBeCalledWith(transactionStatus);
    });
  });
});
