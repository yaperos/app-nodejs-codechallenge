import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ValidateTransactionService } from '../../../src/antifraud/application/validate-transaction.service';
import { EventBusService } from '../../../src/shared/application/event-bus.service';
import { ValidateTransactionDto } from '../../../src/antifraud/infrastructure/dtos/validate-transaction.dto';
import { AntifraudConstants } from '../../../src/antifraud/domain/constants/antifraud.constants';
import { UpdateStatusTransactionEvent } from '../../../src/antifraud/domain/events/update-status-transaction.event';
import { TransactionStatus } from '../../../src/antifraud/domain/enums/transaction-status.enum';

const eventBusService = {
  send: jest.fn(),
};

describe('Validate Transaction Service', () => {
  let validateTransactionService: ValidateTransactionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ValidateTransactionService,
        {
          provide: EventBusService,
          useValue: eventBusService,
        },
      ],
    }).compile();

    validateTransactionService =
      await module.resolve<ValidateTransactionService>(
        ValidateTransactionService,
      );
    jest.clearAllMocks();
  });

  it('should return void and send event approved amount', async () => {
    const validateTransactionDto: ValidateTransactionDto = {
      id: faker.string.uuid(),
      value: AntifraudConstants.MAX_VALUE_TRANSACTION,
    };

    await validateTransactionService.execute(validateTransactionDto);

    const event = UpdateStatusTransactionEvent.create({
      id: validateTransactionDto.id,
      status: TransactionStatus.APPROVED,
    });
    expect(eventBusService.send).toHaveBeenCalledWith(event);
  });

  it('should return void and send event reject amount', async () => {
    const validateTransactionDto: ValidateTransactionDto = {
      id: faker.string.uuid(),
      value: AntifraudConstants.MAX_VALUE_TRANSACTION + 1,
    };

    await validateTransactionService.execute(validateTransactionDto);

    const event = UpdateStatusTransactionEvent.create({
      id: validateTransactionDto.id,
      status: TransactionStatus.REJECTED,
    });
    expect(eventBusService.send).toHaveBeenCalledWith(event);
  });
});
