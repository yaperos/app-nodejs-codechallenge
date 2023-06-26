import { Test } from '@nestjs/testing';
import { TransactionCreator } from '@transactions/application/transaction.creator';
import {
  Transaction,
  TransactionStatus,
} from '@transactions/domain/transaction.entity';
import { TRANSACTION_CREATED } from '@transactions/domain/transaction.event';
import { transactionRequestMock } from '@transactions/infrastructure/dtos/transaction-request.mock';
import { TransactionRepository } from '@transactions/infrastructure/transaction.repository';
import { MessageBus } from '../../shared/message-bus.service';

describe(TransactionCreator, () => {
  let transactionCreator: TransactionCreator;
  let transactionRepository: TransactionRepository;
  let messageBus: MessageBus<Partial<Transaction>, TransactionStatus>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionCreator,
        {
          provide: TransactionRepository,
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: MessageBus,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionCreator = module.get(TransactionCreator);
    transactionRepository = module.get(TransactionRepository);
    messageBus = module.get(MessageBus);
  });

  it('should be defined', () => {
    expect(transactionCreator).toBeDefined();
  });

  it('should create a transaction', async () => {
    const expectedTransaction: Transaction = {
      ...transactionRequestMock,
      id: expect.any(String),
      externalId: expect.any(String),
      status: TransactionStatus.Pending,
      createdAt: expect.any(Date),
    };
    jest.spyOn(transactionRepository, 'save').mockResolvedValue();
    jest
      .spyOn(messageBus, 'send')
      .mockResolvedValue(TransactionStatus.Approved);
    jest.spyOn(transactionRepository, 'update').mockResolvedValue();

    const createdTransaction = await transactionCreator.run(
      transactionRequestMock,
    );

    expect(transactionRepository.save).toHaveBeenCalledWith(
      expectedTransaction,
    );
    expect(messageBus.send).toHaveBeenCalledWith(TRANSACTION_CREATED, {
      id: expectedTransaction.id,
      value: expectedTransaction.value,
    });
    expect(transactionRepository.update).toHaveBeenCalledWith(
      expectedTransaction.id,
      { status: TransactionStatus.Approved },
    );
    expect(createdTransaction).toEqual({
      ...expectedTransaction,
      status: TransactionStatus.Approved,
    });
  });
});
