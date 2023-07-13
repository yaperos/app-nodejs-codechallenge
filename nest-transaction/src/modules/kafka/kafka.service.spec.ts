import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.service';
import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomKafkaClientModule } from '../../app/kafka';

describe('KafkaService', () => {
  let service: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, ClientsModule, CustomKafkaClientModule],
      providers: [KafkaService],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
