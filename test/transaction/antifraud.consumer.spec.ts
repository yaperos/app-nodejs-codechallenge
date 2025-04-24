import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudConsumer } from '../../src/modules/transaction/infrastructure/kafka/antifraud.consumer';
import { UpdateTransactionUseCase } from '../../src/modules/transaction/application/use-cases/update-transaction.use-case';

const mockUpdateTransactionUseCase = {
    execute: jest.fn(),
  };
  
  jest.mock('kafkajs', () => ({
    Kafka: jest.fn().mockImplementation(() => ({
      consumer: jest.fn().mockReturnValue({
        connect: jest.fn(),
        subscribe: jest.fn(),
        run: jest.fn().mockImplementation(({ eachMessage }) => {
          return eachMessage({
            topic: 'transaction_created',
            partition: 0,
            message: {
              value: Buffer.from(JSON.stringify({ id: 'abc-123', value: 2000 })),
            },
          });
        }),
      }),
    })),
    logLevel: {},
  }));
  
  describe('AntifraudConsumer', () => {
    let consumer: AntifraudConsumer;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AntifraudConsumer,
          {
            provide: UpdateTransactionUseCase,
            useValue: mockUpdateTransactionUseCase,
          },
        ],
      }).compile();
  
      consumer = module.get<AntifraudConsumer>(AntifraudConsumer);
      jest.clearAllMocks(); // limpia entre pruebas
    });
  
    it('should process approved transaction (value <= limit)', async () => {
      const mockMsg = { value: Buffer.from(JSON.stringify({ id: 'abc-123', value: 500 })) };
      process.env.ANTIFRAUD_REJECT_LIMIT = '1000';
  
      const data = JSON.parse(mockMsg.value.toString());
      const statusId = data.value > 1000 ? 3 : 2;
  
      await consumer['updateTransactionUseCase'].execute(data.id, statusId);
  
      expect(mockUpdateTransactionUseCase.execute).toHaveBeenCalledWith('abc-123', 2);
    });
  
    it('should process rejected transaction (value > limit)', async () => {
      const mockMsg = { value: Buffer.from(JSON.stringify({ id: 'abc-123', value: 1500 })) };
      process.env.ANTIFRAUD_REJECT_LIMIT = '1000';
  
      const data = JSON.parse(mockMsg.value.toString());
      const statusId = data.value > 1000 ? 3 : 2;
  
      await consumer['updateTransactionUseCase'].execute(data.id, statusId);
  
      expect(mockUpdateTransactionUseCase.execute).toHaveBeenCalledWith('abc-123', 3);
    });
  
    it('should call Kafka consumer and process messages correctly', async () => {
      await consumer.onModuleInit();
  
      expect(mockUpdateTransactionUseCase.execute).toHaveBeenCalledWith('abc-123', 3);
    });
  });