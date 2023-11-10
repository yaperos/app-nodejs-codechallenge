import { ClientKafka } from "@nestjs/microservices";
import { KafkaService } from "./kafka.service";
import { Test, TestingModule } from '@nestjs/testing';

describe('KafkaService (onModuleInit)', () => {
  let service: KafkaService;
  let clientKafka: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    clientKafka = {
      subscribeToResponseOf: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaService,
        { provide: 'KAFKA_SERVICE', useValue: clientKafka },
      ],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
  });

  it('should subscribe to "transactions_created" topic', () => {
    service.onModuleInit();

    expect(clientKafka.subscribeToResponseOf).toHaveBeenCalledWith('transactions_created');
  });
});