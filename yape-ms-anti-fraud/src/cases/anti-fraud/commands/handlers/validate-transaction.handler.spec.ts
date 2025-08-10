import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

/* Project */
import { ValidateTransactionHandler } from './validate-transaction.handler';
import { ValidateTransactionCommand } from '../impl/validate-transaction.command';
import { KafkaService } from '../../../../common/kafka';
import { TRANSACTION_ID_MISSING } from '../../../../common/constants/errors';

/* Mocks / Helpers */
import { validateDTOClass as realValidateDTOClass } from '../../../../common/helpers';

jest.mock('../../../../common/helpers', () => {
  return {
    validateDTOClass: jest.fn(),
  };
});

const mockedValidateDTOClass = realValidateDTOClass as jest.MockedFunction<
  typeof realValidateDTOClass
>;

class MockConfigService {
  private readonly values: Record<string, string> = {
    KAFKA_TRANSACTIONS_VALIDATED_TOPIC: 'validated-topic',
  };

  get<T = string>(key: string): T {
    return this.values[key] as unknown as T;
  }
}

describe('ValidateTransactionHandler', () => {
  let validateTransactionHandler: ValidateTransactionHandler;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        ValidateTransactionHandler,
        {
          provide: KafkaService,
          useValue: {
            publishToTopic: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useClass(MockConfigService)
      .compile();

    kafkaService = module.get<KafkaService>(KafkaService);

    validateTransactionHandler = module.get<ValidateTransactionHandler>(
      ValidateTransactionHandler,
    );

    module.useLogger(new Logger());

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(kafkaService).toBeDefined();
    expect(validateTransactionHandler).toBeDefined();
  });

  it('should publish approved when value <= 1000', async () => {
    mockedValidateDTOClass.mockResolvedValue({
      id: 'tx-1',
      value: 1000,
    } as any);

    const cmd = new ValidateTransactionCommand({} as any);
    await validateTransactionHandler.execute(cmd);

    expect(kafkaService.publishToTopic).toHaveBeenCalledTimes(1);
    expect(kafkaService.publishToTopic).toHaveBeenCalledWith(
      'validated-topic',
      JSON.stringify({ transactionId: 'tx-1', status: 'approved' }),
    );
  });

  it('should publish rejected when value > 1000', async () => {
    mockedValidateDTOClass.mockResolvedValue({
      id: 'tx-2',
      value: 1500,
    } as any);

    const cmd = new ValidateTransactionCommand({} as any);
    await validateTransactionHandler.execute(cmd);

    expect(kafkaService.publishToTopic).toHaveBeenCalledTimes(1);
    expect(kafkaService.publishToTopic).toHaveBeenCalledWith(
      'validated-topic',
      JSON.stringify({ transactionId: 'tx-2', status: 'rejected' }),
    );
  });

  it('should throw when validateDTOClass returns an error', async () => {
    const err = new Error('invalid');
    mockedValidateDTOClass.mockResolvedValue(err as any);

    const cmd = new ValidateTransactionCommand({} as any);

    await expect(validateTransactionHandler.execute(cmd)).rejects.toBe(err);

    expect(kafkaService.publishToTopic).not.toHaveBeenCalled();
  });

  it('should warn and throw TRANSACTION_ID_MISSING when transaction id is missing', async () => {
    const warnSpy = jest
      .spyOn(Logger.prototype as any, 'warn')
      .mockImplementation(() => {});

    mockedValidateDTOClass.mockResolvedValue({
      id: undefined,
      value: 50,
    } as any);

    const cmd = new ValidateTransactionCommand({} as any);

    await expect(validateTransactionHandler.execute(cmd)).rejects.toBe(
      TRANSACTION_ID_MISSING,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      'Received message without transaction.id',
    );
    expect(kafkaService.publishToTopic).not.toHaveBeenCalled();
  });
});
