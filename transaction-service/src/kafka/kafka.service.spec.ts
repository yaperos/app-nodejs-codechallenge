import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { ConfigService } from '@nestjs/config';
import { KafkajsProducer } from './kafkajs.producer';
import { Message } from 'kafkajs';

describe('ProducerService', () => {
  let producerService: ProducerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        ConfigService,
        { provide: KafkajsProducer, useValue: {} }, // Mock KafkajsProducer
      ],
    }).compile();

    producerService = module.get<ProducerService>(ProducerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(producerService).toBeDefined();
  });

  describe('produce', () => {
    it('should produce a message to the specified topic', async () => {
      const topic = 'test-topic';
      const message: Message = { value: 'test-message' };

      const mockProducer = {
        produce: jest.fn(),
        connect: jest.fn(),
        disconnect: jest.fn(),
      };

      jest
        .spyOn(producerService as any, 'getProducer')
        .mockResolvedValue(mockProducer);

      await producerService.produce(topic, message);

      expect(mockProducer.produce).toHaveBeenCalledWith(message);
    });
  });

  
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
});
