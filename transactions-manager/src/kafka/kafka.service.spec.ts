import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from './kafka.service';
import { ClientKafka } from '@nestjs/microservices';

describe('KafkaService', () => {
  let service: KafkaService;
  let clientKafka: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    clientKafka = {
      emit: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaService,
        { provide: 'KAFKA_SERVICE', useValue: clientKafka },
      ],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a message', () => {
    const topic = 'test-topic';
    const message = { key: 'value' };

    service.sendMessage(topic, message);

    expect(clientKafka.emit).toHaveBeenCalledWith(topic, JSON.stringify(message));
  });
});