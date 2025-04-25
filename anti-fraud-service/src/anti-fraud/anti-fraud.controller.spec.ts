import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { HandleTransactionDto } from './dto/handle-transaction.dto';

describe('AntiFraudController', () => {
  let controller: AntiFraudController;

  const mockAntiFraudService = {
    handleTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [
        {
          provide: AntiFraudService,
          useValue: mockAntiFraudService,
        },
      ],
    }).compile();

    controller = module.get<AntiFraudController>(AntiFraudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleTransaction', () => {
    it('should call antiFraudService.handleTransaction and return result', async () => {
      const dto: HandleTransactionDto = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        amount: 200,
      };

      const expectedResult = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        status: 'approved',
      };

      mockAntiFraudService.handleTransaction.mockResolvedValue(expectedResult);

      // eslint-disable-next-line @typescript-eslint/await-thenable
      const result = await controller.handleTransaction(dto);

      expect(mockAntiFraudService.handleTransaction).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
