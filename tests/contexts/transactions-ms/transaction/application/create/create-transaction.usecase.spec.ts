import { ConfigModule } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { CreateTransactionDto } from '../../../../../../src/contexts/transactions-ms/transaction/infraestructure/dtos/create-transaction.dto';
import { CreateTransactionUsecase } from '../../../../../../src/contexts/transactions-ms/transaction/application/create/create-transaction.usecase';
import { TransactionRepository } from '../../../../../../src/contexts/transactions-ms/transaction/domain/transaction.repository';
import {
    TransactionType,
    TransactionTypeName,
} from '../../../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-type.enum';
import { TransactionModel } from '../../../../../../src/contexts/transactions-ms/transaction/domain/transaction.model';
import { TransactionStatus } from '../../../../../../src/contexts/transactions-ms/shared/domain/enums/transaction-status.enum';

const transactionRepository = {
    save: jest.fn(),
};
const mockClientKafka = {
    send: jest.fn(),
    subscribe: jest.fn(),
};
const mockEventEmitter2 = {
    emit: jest.fn(),
};

describe('Create transaction', () => {
    let createTransactionUsecase: CreateTransactionUsecase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env.transactions',
                }),
            ],
            providers: [
                CreateTransactionUsecase,
                {
                    provide: TransactionRepository,
                    useValue: transactionRepository,
                },
                {
                    provide: 'TRANSACTION_CREATED_SERVICE',
                    useValue: mockClientKafka,
                },
                {
                    provide: EventEmitter2,
                    useValue: mockEventEmitter2,
                },
            ],
        }).compile();
        createTransactionUsecase =
            await module.resolve<CreateTransactionUsecase>(
                CreateTransactionUsecase,
            );
        jest.clearAllMocks();
    });

    it('should be define', () => {
        expect(createTransactionUsecase).toBeDefined();
    });

    it('transactionRepository.save should be called with the correct params', async () => {
        const createTransactionDto: CreateTransactionDto = {
            accountExternalIdDebit: faker.datatype.uuid(),
            accountExternalIdCredit: faker.datatype.uuid(),
            tranferTypeId: TransactionType.DEBIT,
            value: 1000,
        };

        const transactionModel: TransactionModel = {
            id: faker.datatype.uuid(),
            status: TransactionStatus.PENDING,
            createdAt: new Date(),
            transactionTypeName: TransactionTypeName.DEBIT,
            ...createTransactionDto,
        };

        jest.spyOn(TransactionModel, 'fromCreateDto').mockReturnValue(
            transactionModel,
        );
        transactionRepository.save.mockReturnValue(transactionModel);
        mockClientKafka.send.mockReturnValue({
            subscribe: () => jest.fn(),
        });

        await createTransactionUsecase.createTransaction(createTransactionDto);

        expect(transactionRepository.save).toHaveBeenCalledWith(
            transactionModel,
        );
    });
});
