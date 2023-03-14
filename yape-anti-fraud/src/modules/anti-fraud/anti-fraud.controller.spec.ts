import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudMock } from './anti-fraud.mock.spec';
import { AntiFraudService } from './anti-fraud.service';

describe('AntiFraudController', () => {
  let antifraudController: AntiFraudController;
  const antiFraudMock = new AntiFraudMock();
  const validateTransactionDto = AntiFraudMock.validateTransactionDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [
        {
          provide: AntiFraudService,
          useValue: antiFraudMock,
        },
      ],
    }).compile();

    antifraudController = module.get<AntiFraudController>(AntiFraudController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(antifraudController).toBeDefined();
  });

  it('validateTransaction should called service antifraud', async () => {
    const spyValidateTransaction = jest.spyOn(
      antiFraudMock,
      'validateTransaction',
    );
    await antifraudController.validateTransaction(validateTransactionDto);
    expect(spyValidateTransaction).toHaveBeenCalledWith(validateTransactionDto);
  });
});
