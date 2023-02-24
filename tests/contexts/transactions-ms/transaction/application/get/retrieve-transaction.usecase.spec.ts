import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { TransactionRepository } from '../../../../../../src/contexts/transactions-ms/transaction/domain/transaction.repository';
import { TransactionStatus } from '../../../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-status.enum';
import {
    TransactionType,
    TransactionTypeName,
} from '../../../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-type.enum';
import { TransactionModel } from '../../../../../../src/contexts/transactions-ms/transaction/domain/transaction.model';
import { RetrieveTransactionUsecase } from '../../../../../../src/contexts/transactions-ms/transaction/application/get/retrieve-transaction.usecase';

const transactionRepository = {
    getById: jest.fn(),
};

describe('Retrieve transaction', () => {
    let retrieveTransactionUsecase: RetrieveTransactionUsecase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env.transactions',
                }),
            ],
            providers: [
                RetrieveTransactionUsecase,
                {
                    provide: TransactionRepository,
                    useValue: transactionRepository,
                },
            ],
        }).compile();
        retrieveTransactionUsecase =
            await module.resolve<RetrieveTransactionUsecase>(
                RetrieveTransactionUsecase,
            );
        jest.clearAllMocks();
    });

    it('should be define', () => {
        expect(retrieveTransactionUsecase).toBeDefined();
    });

    it('transactionRepository.getById should be called with the correct params', async () => {
        const id = faker.datatype.uuid();

        const transactionModel: TransactionModel = {
            id,
            status: TransactionStatus.PENDING,
            createdAt: new Date(),
            transactionTypeName: TransactionTypeName.DEBIT,
            accountExternalIdDebit: faker.datatype.uuid(),
            accountExternalIdCredit: faker.datatype.uuid(),
            tranferTypeId: TransactionType.DEBIT,
            value: 1000,
        };

        transactionRepository.getById.mockReturnValue(transactionModel);

        await retrieveTransactionUsecase.getTransactionData(id);

        expect(transactionRepository.getById).toHaveBeenCalledWith(id);
    });

    it('retrieveTransactionUsecase.getTransactionData should retrieve transaction reponse dto', async () => {
        const id = faker.datatype.uuid();

        const transaction: TransactionModel = {
            id,
            status: TransactionStatus.PENDING,
            createdAt: new Date(),
            transactionTypeName: TransactionTypeName.DEBIT,
            accountExternalIdDebit: faker.datatype.uuid(),
            accountExternalIdCredit: faker.datatype.uuid(),
            tranferTypeId: TransactionType.DEBIT,
            value: 1000,
        };

        transactionRepository.getById.mockReturnValue(transaction);

        const response = await retrieveTransactionUsecase.getTransactionData(
            id,
        );

        expect(response).toEqual({
            transactionExternalId: transaction.id,
            transactionType: {
                name: transaction.transactionTypeName,
            },
            transactionStatus: {
                name: transaction.status,
            },
            value: transaction.value,
            createdAt: transaction.createdAt,
        });
    });
});
