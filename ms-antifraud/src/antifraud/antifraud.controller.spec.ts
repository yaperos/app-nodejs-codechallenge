import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';
import { TransactionDto } from './dto/transaction.dto';

describe('AntifraudController', () => {
  let controller: AntifraudController;
  let antifraudService: AntifraudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntifraudController],
      providers: [
        AntifraudService,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AntifraudController>(AntifraudController);
    antifraudService = module.get<AntifraudService>(AntifraudService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleTransactionCreated', () => {
    it('should call verifyAntifraud method of AntifraudService with correct transaction data', async () => {
      const mockTransaction: TransactionDto = {
        id: 'd22ccc68-3f31-4498-a12b-63356f6960e7',
        value: 800,
        transactionStatus: 1,
      }

      const verifyAntifraudSpy = jest.spyOn(antifraudService, 'verifyAntifraud').mockResolvedValueOnce(undefined);
      await controller.handleTransactionCreated(mockTransaction);

      expect(verifyAntifraudSpy).toHaveBeenCalledWith(mockTransaction);
    })
  })
});
