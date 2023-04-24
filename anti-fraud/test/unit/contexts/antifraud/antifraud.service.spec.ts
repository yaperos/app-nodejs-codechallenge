import { Test, TestingModule } from "@nestjs/testing";

import { headers, insertedDataMock, transaction, uuidMock } from "../../mocks/transaction";
import { ConfigService } from "@nestjs/config";
import {AntifraudService} from "../../../../src/contexts/antifraud/antifraud.service";
import {KafkaService} from "../../../../src/config/bus/kafka/kafka.service";
import {CreateAntiFraud} from "../../../../src/contexts/antifraud/events/create.antiFraud";
import {LoggerService} from "../../../../src/config/logger/logger.service";
import {TracerService} from "../../../../src/config/tracer/tracer.service";
import {TransactionDto} from "../../../../src/contexts/antifraud/dto/transaction.dto";


const results = {
  mock: true,
  test: 'test',
  data: { access_token: 'access_token', status: 'ACCEPTED_CREATION_IN_PROGRESS' },
};

describe('antiFraudService', () => {
  let service: AntifraudService;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntifraudService,
        {
          provide: KafkaService,
          useValue: {
            emit: jest
                .fn()
                .mockImplementation((createAntiFraud: CreateAntiFraud) =>
                    Promise.resolve(createAntiFraud.getData()),
                ),
          },
        },
      ],
    })
      .useMocker((token) => {
        if (token === LoggerService) {
          return {
            log: jest.fn().mockResolvedValue(results),
            error: jest.fn().mockResolvedValue(results),
          };
        }
        if (token === TracerService) {
          return { getTrace: jest.fn().mockReturnValue(uuidMock) };
        }
        if (token === ConfigService) {
          return { get: jest.fn().mockResolvedValue(5) };
        }
      })
      .compile();

    service = module.get<AntifraudService>(AntifraudService);
    kafkaService = module.get<KafkaService>(KafkaService);

  });

  it('module should be defined', async () => {
    expect(module).toBeDefined();
  });

  it('module should have GuidesService instance', async () => {
    expect(service).toBeInstanceOf(AntifraudService);
  });
  it('service should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should post successfully', async () => {
    const response = await service.create(transaction as unknown as TransactionDto, headers);
    expect(response).toBeDefined();
  });

  it('should notify antifraud', async () => {
    await service.create(transaction as unknown as TransactionDto, headers);

    const antiFraudEvent = new CreateAntiFraud(transaction, {
      commerce: headers.commerce,
      eventId: uuidMock,
      entityId: 'a',
      eventType: 'approved',
      channel: 'YAPE'
    });

    const kafkaResponse = await kafkaService.emit(antiFraudEvent);
    expect(kafkaResponse).toEqual(transaction);
  });

});
