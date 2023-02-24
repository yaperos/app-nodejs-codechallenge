import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { TransactionRepository } from '../../../../../../src/contexts/transactions-ms/transaction/domain/transaction.repository';
import { ValidationTransactionDto } from '../../../../../../src/contexts/transactions-ms/transaction/infraestructure/dtos/validation-transaction.dto';
import { TransactionStatus } from '../../../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-status.enum';
import { UpdateTransactionStatusUsecase } from '../../../../../../src/contexts/transactions-ms/transaction/application/update/update-transaction-status.usecase';

const transactionRepository = {
    updateStatus: jest.fn(),
};

describe('Update transaction status', () => {
    let updateTransactionStatusUsecase: UpdateTransactionStatusUsecase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env.transactions',
                }),
            ],
            providers: [
                UpdateTransactionStatusUsecase,
                {
                    provide: TransactionRepository,
                    useValue: transactionRepository,
                },
            ],
        }).compile();
        updateTransactionStatusUsecase =
            await module.resolve<UpdateTransactionStatusUsecase>(
                UpdateTransactionStatusUsecase,
            );
        jest.clearAllMocks();
    });

    it('should be define', () => {
        expect(updateTransactionStatusUsecase).toBeDefined();
    });

    it('transactionRepository.updateStatus should be called with approved param', async () => {
        const validation: ValidationTransactionDto = {
            transactionId: faker.datatype.uuid(),
            isValid: true,
        };

        await updateTransactionStatusUsecase.updateStatusOnValidator(
            validation,
        );

        expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
            validation.transactionId,
            TransactionStatus.APPROVED,
        );
    });

    it('transactionRepository.updateStatus should be called with rejected param', async () => {
        const validation: ValidationTransactionDto = {
            transactionId: faker.datatype.uuid(),
            isValid: false,
        };

        await updateTransactionStatusUsecase.updateStatusOnValidator(
            validation,
        );

        expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
            validation.transactionId,
            TransactionStatus.REJECTED,
        );
    });
});
