import { Test, TestingModule } from '@nestjs/testing';
import { environment } from '@core/config/environment';
import { AntiFraudMock } from './anti-fraud.mock.spec';
import { AntiFraudService } from './anti-fraud.service';
import { of } from 'rxjs';
import { TransactionValidateStatus } from '@core/config/constant';

describe('AntiFraudService', () => {
  let antiFraudService: AntiFraudService;
  const antiFraudMock = new AntiFraudMock();
  const validateTransactionDto = AntiFraudMock.validateTransactionDto;

  beforeEach(async () => {
    environment.transactionKafkaConfig.name =
      AntiFraudMock.kafkaNameTransaction;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: AntiFraudMock.kafkaNameTransaction,
          useValue: antiFraudMock,
        },
      ],
    }).compile();

    antiFraudService = module.get<AntiFraudService>(AntiFraudService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(antiFraudService).toBeDefined();
  });

  it('validateAmountValue should be boolean true', async () => {
    const amountValid = environment.transactionLimit;
    //@ts-ignore
    const response = antiFraudService.validateAmountValue(amountValid);
    expect(response).toBe(true);
  });

  it('validateAmountValue should be boolean flase', async () => {
    const amountInvalid = environment.transactionLimit + 1;
    //@ts-ignore
    const response = antiFraudService.validateAmountValue(amountInvalid);
    expect(response).toBe(false);
  });

  it('validateTransaction should be executed ok with Approved Transaction', async () => {
    const spyEmit = jest
      .spyOn(antiFraudMock, 'emit')
      .mockReturnValueOnce(of(null));

    //@ts-ignore
    const spyValidateAmountValue = jest //@ts-ignore
      .spyOn(antiFraudService, 'validateAmountValue') //@ts-ignore
      .mockReturnValueOnce(true);

    await antiFraudService.validateTransaction(validateTransactionDto);

    expect(spyValidateAmountValue).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledWith(
      TransactionValidateStatus.APPROVED_TRANSACTION,
      JSON.stringify({
        transactionExternalId: validateTransactionDto.transactionExternalId,
        isValid: true,
      }),
    );
  });

  it('validateTransaction should be executed ok with Rejected Transaction', async () => {
    const spyEmit = jest
      .spyOn(antiFraudMock, 'emit')
      .mockReturnValueOnce(of(null));

    //@ts-ignore
    const spyValidateAmountValue = jest //@ts-ignore
      .spyOn(antiFraudService, 'validateAmountValue') //@ts-ignore
      .mockReturnValueOnce(false);

    await antiFraudService.validateTransaction(validateTransactionDto);

    expect(spyValidateAmountValue).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledWith(
      TransactionValidateStatus.REJECTED_TRANSACTION,
      JSON.stringify({
        transactionExternalId: validateTransactionDto.transactionExternalId,
        isValid: false,
      }),
    );
  });
});
