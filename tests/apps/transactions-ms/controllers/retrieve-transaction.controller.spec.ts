import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { TransactionStatus } from '../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-status.enum';
import { TransactionTypeName } from '../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-type.enum';
import { TransactionResponseDto } from '../../../../src/contexts/transactions-ms/transaction/infraestructure/dtos/transaction-response.dto';
import { RetrieveTransactionController } from '../../../../src/apps/transactions-ms/controllers/retrieve-transaction.controller';
import { RetrieveTransactionUsecase } from '../../../../src/contexts/transactions-ms/transaction/application/get/retrieve-transaction.usecase';

const retrieveTransactionUsecase = {
    getTransactionData: jest.fn(),
};

describe('Create transaction', () => {
    let retrieveTransactionController: RetrieveTransactionController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [RetrieveTransactionController],
            providers: [
                {
                    provide: RetrieveTransactionUsecase,
                    useValue: retrieveTransactionUsecase,
                },
            ],
        }).compile();
        retrieveTransactionController =
            await module.resolve<RetrieveTransactionController>(
                RetrieveTransactionController,
            );
        jest.clearAllMocks();
    });

    it('should be define', () => {
        expect(retrieveTransactionController).toBeDefined();
    });

    it('should return transaction response', () => {
        const id = faker.datatype.uuid();

        const transactionResponse: TransactionResponseDto = {
            transactionExternalId: id,
            transactionType: {
                name: TransactionTypeName.DEBIT,
            },
            transactionStatus: {
                name: TransactionStatus.APPROVED,
            },
            value: 1300,
            createdAt: new Date(),
        };

        retrieveTransactionUsecase.getTransactionData.mockReturnValue(
            transactionResponse,
        );

        const response = retrieveTransactionController.getTransaction(id);

        expect(response).toEqual(transactionResponse);
    });
});
