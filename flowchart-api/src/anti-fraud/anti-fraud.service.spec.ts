import { Test } from '@nestjs/testing';
import { AntiFraudService } from './anti-fraud.service';
import { Producer } from 'kafkajs';

describe('AntiFraudService', () => {
  let antiFraudService: AntiFraudService;
  let kafkaProducer: Producer;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: 'KAFKA_CONSUMER',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    antiFraudService = moduleRef.get<AntiFraudService>(AntiFraudService);
    kafkaProducer = moduleRef.get<Producer>('KAFKA_CONSUMER');
  });

  describe('manageTransaction', () => {
    it('should send transaction to approved topic when transaction value is less or equal to 1000', async () => {
      const mockTransaction = {
        key: 'test-key',
        value: '1000',
      };
      const expectedResult = {
        message: mockTransaction,
        status: {
          id: 2,
          name: 'approved',
        },
      };
      const kafkaProducerSpy = jest.spyOn(kafkaProducer, 'send').mockResolvedValueOnce(null);

      const result = await antiFraudService.manageTransaction(mockTransaction);

      expect(result).toEqual(expectedResult);
      expect(kafkaProducerSpy).toHaveBeenCalledWith({
        topic: 'transactions-approved',
        messages: [
          {
            key: 'transactions-approved',
            value: JSON.stringify({
              ...mockTransaction,
              newStatus: expectedResult.status.id,
            }),
          },
        ],
      });
    });

    it('should send transaction to rejected topic when transaction value is greater than 1000', async () => {
      const mockTransaction = {
        key: 'test-key',
        value: '2000',
      };
      const expectedResult = {
        message: mockTransaction,
        status: {
          id: 3,
          name: 'rejected',
        },
      };
      const kafkaProducerSpy = jest.spyOn(kafkaProducer, 'send').mockResolvedValueOnce(null);

      const result = await antiFraudService.manageTransaction(mockTransaction);

      expect(result).toEqual(expectedResult);
      expect(kafkaProducerSpy).toHaveBeenCalledWith({
        topic: 'transactions-rejected',
        messages: [
          {
            key: 'transactions-rejected',
            value: JSON.stringify({
              ...mockTransaction,
              newStatus: expectedResult.status.id,
            }),
          },
        ],
      });
    });
  });
});
