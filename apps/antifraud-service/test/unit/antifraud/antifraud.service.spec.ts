import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudService } from '../../../src/modules/antifraud/antifraud.service';
import { UPDATE_TRANSACTION_STATUS } from 'constants/kafka-topics';
const mockEmit = jest.fn();

describe('AntifraudService', () => {
  let testingModule: TestingModule;
  let service: AntifraudService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AntifraudService,
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: mockEmit,
          }),
        },
      ],
    }).compile();

    service = testingModule.get<AntifraudService>(AntifraudService);
  });

  describe('validateTransaction', () => {
    it('should validate a transaction with a value over 1000', () => {
      service.validateTransaction('transactionId1', 1500);
      expect(mockEmit).toHaveBeenCalledWith(
        UPDATE_TRANSACTION_STATUS,
        JSON.stringify({ transactionId: 'transactionId1', status: 3 }),
      );
    });

    it('should validate a transaction with a value of 1000 or less', () => {
      service.validateTransaction('transactionId2', 900);
      expect(mockEmit).toHaveBeenCalledWith(
        UPDATE_TRANSACTION_STATUS,
        JSON.stringify({ transactionId: 'transactionId2', status: 2 }),
      );
    });
  });
});
