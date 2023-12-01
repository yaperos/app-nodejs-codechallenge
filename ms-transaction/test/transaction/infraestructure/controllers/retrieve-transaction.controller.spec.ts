import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { RetrieveTransactionController } from '../../../../src/transaction/infrastructure/controllers/retrieve-transaction.controller';
import { RetrieveTransactionService } from '../../../../src/transaction/application/retrieve-transaction.service';
import { CreateTransactionDto } from '../../../../src/transaction/infrastructure/dtos/create-transaction.dto';
import { TransactionTransferType } from '../../../../src/transaction/domain/enums/transaction-transfer-type.enum';
import { TransactionModel } from '../../../../src/transaction/domain/models/transaction.model';

const retrieveTransactionService = {
  execute: jest.fn(),
};

describe('Retrieve Transaction Controler', () => {
  let retrieveTransactionController: RetrieveTransactionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [RetrieveTransactionController],
      providers: [
        {
          provide: RetrieveTransactionService,
          useValue: retrieveTransactionService,
        },
      ],
    }).compile();

    retrieveTransactionController =
      await module.resolve<RetrieveTransactionController>(
        RetrieveTransactionController,
      );
    jest.clearAllMocks();
  });

  it('should return description transaction', async () => {
    const createTransactionDto: CreateTransactionDto = {
      accountExternalIdDebit: faker.string.uuid(),
      accountExternalIdCredit: faker.string.uuid(),
      tranferTypeId: TransactionTransferType.DEBIT,
      value: faker.number.int(),
    };

    const transaction = TransactionModel.createFromDto(createTransactionDto);

    retrieveTransactionService.execute.mockResolvedValue(
      transaction.toDescriptionObject(),
    );

    const response = await retrieveTransactionController.get(transaction.id);

    expect(retrieveTransactionService.execute).toHaveBeenCalled();
    expect(response).toEqual(transaction.toDescriptionObject());
    expect(response.transactionExternalId).toBe(transaction.id);
  });

  it('should throw BadRequestException for internal general error', async () => {
    retrieveTransactionService.execute.mockRejectedValue(
      new Error('general error'),
    );

    await expect(async () => {
      await retrieveTransactionController.get(faker.string.uuid());
    }).rejects.toThrow(BadRequestException);
  });
});
