import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { StatusType, StatusTypeLabels } from '@app/common';
import { CreateTransactionHandler } from '../create-transaction.handler';
import { ITransactionRepository } from '../../../../domain/repositories/itransaction.repository';
import { ITransactionTypeRepository } from '../../../../domain/repositories/itransaction-type.repository';
import { CreateTransactionRequest } from '../../../dtos/create-transaction.dto';
import { TransactionType } from '../../../../domain/entities/transaction-type.entity';
import { TransactionStatus } from '../../../../domain/entities/status.entity';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { CreateTransactionCommand } from '../create-transaction.command';

jest.mock('uuid', () => ({
  v4: () => 'fixed-transaction-id',
}));

describe('CreateTransactionHandler', () => {
  let handler: CreateTransactionHandler;
  let transactionRepository: ITransactionRepository;
  let transactionTypeRepository: ITransactionTypeRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionHandler,
        {
          provide: 'ITransactionRepository',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'ITransactionTypeRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateTransactionHandler>(CreateTransactionHandler);
    transactionRepository = module.get<ITransactionRepository>(
      'ITransactionRepository',
    );
    transactionTypeRepository = module.get<ITransactionTypeRepository>(
      'ITransactionTypeRepository',
    );
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should create a transaction', async () => {
    const createTransactionRequest: CreateTransactionRequest = {
      accountExternalIdDebit: 'debit-id',
      accountExternalIdCredit: 'credit-id',
      tranferTypeId: 1,
      value: 100,
    };

    const transactionExternalId = 'fixed-transaction-id';
    const transactionStatus = new TransactionStatus(
      StatusType.pending,
      StatusTypeLabels[StatusType.pending],
    );
    const transactionType = new TransactionType(1, 'type-name');

    const transactionResponse = Transaction.create(
      transactionExternalId,
      createTransactionRequest.accountExternalIdDebit,
      createTransactionRequest.accountExternalIdCredit,
      createTransactionRequest.value,
      transactionStatus,
      transactionType,
    );

    jest
      .spyOn(transactionTypeRepository, 'findById')
      .mockResolvedValue(transactionType);
    jest
      .spyOn(transactionRepository, 'create')
      .mockResolvedValue(transactionResponse);

    const command = new CreateTransactionCommand(createTransactionRequest);

    const result = await handler.execute(command);

    expect(result.transactionExternalId).toBe(transactionExternalId);
    expect(transactionRepository.create).toHaveBeenCalledWith(
      transactionResponse,
    );
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
