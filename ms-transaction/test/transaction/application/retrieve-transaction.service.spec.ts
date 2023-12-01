import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RetrieveTransactionService } from '../../../src/transaction/application/retrieve-transaction.service';
import { TransactionRepository } from '../../../src/transaction/domain/repositories/transaction.repository';
import { CreateTransactionDto } from '../../../src/transaction/infrastructure/dtos/create-transaction.dto';
import { TransactionTransferType } from '../../../src/transaction/domain/enums/transaction-transfer-type.enum';
import { TransactionModel } from '../../../src/transaction/domain/models/transaction.model';

const transactionRepository = {
  save: jest.fn(),
  getById: jest.fn(),
  updateStatus: jest.fn(),
};

describe('Retrieve Transaction Service', () => {
  let retrieveTransactionService: RetrieveTransactionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RetrieveTransactionService,
        {
          provide: TransactionRepository,
          useValue: transactionRepository,
        },
      ],
    }).compile();

    retrieveTransactionService =
      await module.resolve<RetrieveTransactionService>(
        RetrieveTransactionService,
      );
    jest.clearAllMocks();
  });

  it('should return existing transaction', async () => {
    const createTransactionDto: CreateTransactionDto = {
      accountExternalIdDebit: faker.string.uuid(),
      accountExternalIdCredit: faker.string.uuid(),
      tranferTypeId: TransactionTransferType.CREDIT,
      value: faker.number.int(),
    };
    const transaction = TransactionModel.createFromDto(createTransactionDto);

    transactionRepository.getById.mockResolvedValue(transaction);

    const response = await retrieveTransactionService.execute(transaction.id);

    expect(transactionRepository.getById).toHaveBeenCalledWith(transaction.id);
    expect(response).toEqual(transaction.toDescriptionObject());
  });

  it('should throw Error by no existing transaction', async () => {
    transactionRepository.getById.mockResolvedValue(null);

    await expect(async () => {
      await retrieveTransactionService.execute(faker.string.uuid());
    }).rejects.toThrow(new Error('Invalid transaction'));
  });
});
