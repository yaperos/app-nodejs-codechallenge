import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { CreateTransactionController } from '../../../../src/transaction/infrastructure/controllers/create-transaction.controller';
import { CreateTransactionService } from '../../../../src/transaction/application/create-transaction.service';
import { CreateTransactionDto } from '../../../../src/transaction/infrastructure/dtos/create-transaction.dto';
import { TransactionTransferType } from '../../../../src/transaction/domain/enums/transaction-transfer-type.enum';
import { TransactionModel } from '../../../../src/transaction/domain/models/transaction.model';

const createTransactionService = {
  execute: jest.fn(),
};

describe('Create Transaction Controller', () => {
  let createTransactionController: CreateTransactionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CreateTransactionController],
      providers: [
        {
          provide: CreateTransactionService,
          useValue: createTransactionService,
        },
      ],
    }).compile();

    createTransactionController =
      await module.resolve<CreateTransactionController>(
        CreateTransactionController,
      );
    jest.clearAllMocks();
  });

  it('should return new transaction', async () => {
    const createTransactionDto: CreateTransactionDto = {
      accountExternalIdDebit: faker.string.uuid(),
      accountExternalIdCredit: faker.string.uuid(),
      tranferTypeId: TransactionTransferType.DEBIT,
      value: faker.number.int(),
    };

    const transaction = TransactionModel.createFromDto(createTransactionDto);

    createTransactionService.execute.mockResolvedValue(transaction);

    const response =
      await createTransactionController.create(createTransactionDto);

    expect(createTransactionService.execute).toHaveBeenCalled();
    expect(response).toEqual(transaction);
  });

  it('should throw BadRequestException for internal general error', async () => {
    const createTransactionDto: CreateTransactionDto = {
      accountExternalIdDebit: faker.string.uuid(),
      accountExternalIdCredit: faker.string.uuid(),
      tranferTypeId: TransactionTransferType.DEBIT,
      value: faker.number.int(),
    };

    createTransactionService.execute.mockRejectedValue(
      new Error('general error'),
    );

    await expect(async () => {
      await createTransactionController.create(createTransactionDto);
    }).rejects.toThrow(BadRequestException);
  });
});
