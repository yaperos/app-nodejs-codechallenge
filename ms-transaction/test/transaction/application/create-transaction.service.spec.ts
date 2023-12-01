import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { CreateTransactionService } from '../../../src/transaction/application/create-transaction.service';
import { TransactionRepository } from '../../../src/transaction/domain/repositories/transaction.repository';
import { EventBusService } from '../../../src/shared/application/event-bus.service';
import { CreateTransactionDto } from '../../../src/transaction/infrastructure/dtos/create-transaction.dto';
import { TransactionTransferType } from '../../../src/transaction/domain/enums/transaction-transfer-type.enum';
import { TransactionStatus } from '../../../src/transaction/domain/enums/transaction-status.enum';

const transactionRepository = {
  save: jest.fn(),
  getById: jest.fn(),
  updateStatus: jest.fn(),
};

const eventBusService = {
  send: jest.fn(),
};

describe('Create Transaction Service', () => {
  let createTransactionService: CreateTransactionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateTransactionService,
        {
          provide: TransactionRepository,
          useValue: transactionRepository,
        },
        {
          provide: EventBusService,
          useValue: eventBusService,
        },
      ],
    }).compile();

    createTransactionService = await module.resolve<CreateTransactionService>(
      CreateTransactionService,
    );
    jest.clearAllMocks();
  });

  it('should return success transaction', async () => {
    const createTransactionDto: CreateTransactionDto = {
      accountExternalIdDebit: faker.string.uuid(),
      accountExternalIdCredit: faker.string.uuid(),
      tranferTypeId: TransactionTransferType.DEBIT,
      value: faker.number.int(),
    };

    const response =
      await createTransactionService.execute(createTransactionDto);

    expect(transactionRepository.save).toHaveBeenCalled();
    expect(eventBusService.send).toHaveBeenCalled();
    expect(response.accountExternalIdDebit).toEqual(
      createTransactionDto.accountExternalIdDebit,
    );
    expect(response.accountExternalIdCredit).toEqual(
      createTransactionDto.accountExternalIdCredit,
    );
    expect(response.transferTypeId).toEqual(createTransactionDto.tranferTypeId);
    expect(response.value).toEqual(createTransactionDto.value);
    expect(response.status).toEqual(TransactionStatus.PENDING);
    expect(response.id).toBeDefined();
  });
});
