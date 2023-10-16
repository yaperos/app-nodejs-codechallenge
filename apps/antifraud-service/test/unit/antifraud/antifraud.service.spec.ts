import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudService } from './antifraud.service';
import { ClientKafka } from '@nestjs/microservices';

describe('AntifraudService', () => {
  let antifraudService: AntifraudService;
  let kafkaClient: Partial<ClientKafka>;

  beforeEach(async () => {
    kafkaClient = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntifraudService,
        {
          provide: 'KAFKA_CLIENT',
          useValue: kafkaClient,
        },
      ],
    }).compile();

    antifraudService = module.get<AntifraudService>(AntifraudService);
  });

  describe('validateTransaction', () => {
    it('should validate a transaction with a value over 1000', () => {
      antifraudService.validateTransaction('transactionId1', 1500);
      expect(kafkaClient.emit).toHaveBeenCalledWith(
        'UPDATE_TRANSACTION_STATUS',
        JSON.stringify({ transactionId: 'transactionId1', status: 'REJECTED' }),
      );
    });

    it('should validate a transaction with a value of 1000 or less', () => {
      antifraudService.validateTransaction('transactionId2', 900);
      expect(kafkaClient.emit).toHaveBeenCalledWith(
        'UPDATE_TRANSACTION_STATUS',
        JSON.stringify({ transactionId: 'transactionId2', status: 'APPROVED' }),
      );
    });
  });
});