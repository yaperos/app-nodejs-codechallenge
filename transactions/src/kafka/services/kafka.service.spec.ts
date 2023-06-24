import * as rxjs from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { KafkaService } from './kafka.service';

describe('KafkaService', () => {
  let service: KafkaService;
  let kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaService,
        {
          provide: 'KAFKA_CLIENT',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
    kafkaClient = module.get<ClientKafka>('KAFKA_CLIENT');
  });

  it('emitEvent should call the emit client method', async () => {
    jest.spyOn(rxjs, 'lastValueFrom').mockResolvedValue({} as any);
    await service.emitEvent('transaction.create', { id: '1' });

    expect(kafkaClient.emit).toBeCalledWith('transaction.create', { id: '1' });
  });
});
