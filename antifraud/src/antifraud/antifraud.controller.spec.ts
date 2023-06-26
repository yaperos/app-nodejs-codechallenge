import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';

describe('AntifraudController', () => {
  let controller: AntifraudController;
  let service: AntifraudService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntifraudController],
      providers: [
        {
          provide: AntifraudService,
          useValue: {
            validateTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AntifraudController);
    service = module.get(AntifraudService);
  });

  describe('when transaction value is less than 1000', () => {
    it('should return approved', async () => {
      const transactionInput = { id: '1', value: 1000 };
      const expectedStatus = 'approved';
      jest
        .spyOn(service, 'validateTransaction')
        .mockImplementation(() => 'approved');

      const result = await controller.handleTransactionCreated(
        transactionInput,
      );

      expect(service.validateTransaction).toHaveBeenCalledWith(
        transactionInput,
      );
      expect(result).toBe(expectedStatus);
    });
  });

  describe('when transaction value is greater than 1000', () => {
    it('should return failed', async () => {
      const transactionInput = { id: '1', value: 1001 };
      const expectedStatus = 'failed';
      jest
        .spyOn(service, 'validateTransaction')
        .mockImplementation(() => 'failed');

      const result = await controller.handleTransactionCreated(
        transactionInput,
      );

      expect(service.validateTransaction).toHaveBeenCalledWith(
        transactionInput,
      );
      expect(result).toBe(expectedStatus);
    });
  });
});
