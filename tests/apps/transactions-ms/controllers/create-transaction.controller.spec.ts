import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { TransactionStatus } from '../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-status.enum';
import {
    TransactionType,
    TransactionTypeName,
} from '../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-type.enum';
import { TransactionModel } from '../../../../src/contexts/transactions-ms/transaction/domain/transaction.model';
import { CreateTransactionDto } from '../../../../src/contexts/transactions-ms/transaction/infraestructure/dtos/create-transaction.dto';
import { CreateTransactionController } from '../../../../src/apps/transactions-ms/controllers/create-transaction.controller';
import { CreateTransactionUsecase } from '../../../../src/contexts/transactions-ms/transaction/application/create/create-transaction.usecase';

const createTransactionUsecase = {
    createTransaction: jest.fn(),
};

describe('Create transaction', () => {
    let createTransactionController: CreateTransactionController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [CreateTransactionController],
            providers: [
                {
                    provide: CreateTransactionUsecase,
                    useValue: createTransactionUsecase,
                },
            ],
        }).compile();
        createTransactionController =
            await module.resolve<CreateTransactionController>(
                CreateTransactionController,
            );
        jest.clearAllMocks();
    });

    it('should be define', () => {
        expect(createTransactionController).toBeDefined();
    });

    it('should return transaction model created', () => {
        const createTransactionDto: CreateTransactionDto = {
            accountExternalIdDebit: faker.datatype.uuid(),
            accountExternalIdCredit: faker.datatype.uuid(),
            tranferTypeId: TransactionType.DEBIT,
            value: 1000,
        };

        const transaction: TransactionModel = {
            id: faker.datatype.uuid(),
            status: TransactionStatus.PENDING,
            createdAt: new Date(),
            transactionTypeName: TransactionTypeName.DEBIT,
            ...createTransactionDto,
        };

        createTransactionUsecase.createTransaction.mockReturnValue(transaction);

        const response =
            createTransactionController.create(createTransactionDto);

        expect(response).toEqual(transaction);
    });
});
