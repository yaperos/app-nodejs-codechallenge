import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudService } from '../../../src/modules/anti-fraud/anti-fraud.service';
import { ClientKafka } from '@nestjs/microservices';
import { CreateAntiFraudDto } from '../../../src/modules/anti-fraud/dto/create-anti-fraud.dto';

describe('AntiFraudService', () => {
  let service: AntiFraudService;
  let kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: 'KAFKA',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AntiFraudService>(AntiFraudService);
    kafkaClient = module.get<ClientKafka>('KAFKA');
  });

  describe('create', () => {
    it('should create an anti-fraud record and emit a Kafka message approved', async () => {
      const createAntiFraudDto: CreateAntiFraudDto = {
        id: '123',
        amount: 100,
      };

      await service.create(createAntiFraudDto);

      expect(kafkaClient.emit).toHaveBeenCalledWith('transaction-update', {
        id: '123',
        status: 'approved',
      });
    });

    it('should create an anti-fraud record and emit a Kafka message rejected', async () => {
      const createAntiFraudDto: CreateAntiFraudDto = {
        id: '123',
        amount: 10000,
      };
      await service.create(createAntiFraudDto);
      expect(kafkaClient.emit).toHaveBeenCalledWith('transaction-update', {
        id: '123',
        status: 'rejected',
      });
    });
  });
});
