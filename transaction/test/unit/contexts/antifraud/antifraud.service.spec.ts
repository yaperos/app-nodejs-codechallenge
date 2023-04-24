import { AntifraudService } from "@/contexts/antifraud/antifraud.service";
import { KafkaService } from "@/config/bus/kafka/kafka.service";
import { Test, TestingModule } from "@nestjs/testing";
import { LoggerService } from "@/config/logger/logger.service";
import { TracerService } from "@/config/tracer/tracer.service";
import { headers, insertedDataMock, transaction, uuidMock } from "../../mocks/transaction";
import { ConfigService } from "@nestjs/config";
import { TransactionRepository } from "@/contexts/transaction/transaction.repository";
import { TransactionDto } from "@/contexts/transaction/dto/transaction.dto";

const results = {
  mock: true,
  test: 'test',
  data: { access_token: 'access_token', status: 'ACCEPTED_CREATION_IN_PROGRESS' },
};

describe('antiFraudService', () => {
  let service: AntifraudService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntifraudService,
        {
          provide: TransactionRepository,
          useValue: {
            updateData: jest.fn().mockResolvedValue(insertedDataMock),
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
    expect(response).toBe(insertedDataMock);
  });

});
