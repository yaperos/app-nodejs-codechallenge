import { CqrsModule } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";
import { TransactionInfrastructure } from "../../../../src/infrastructure/transaction.infrastructure";
import { CreateTransactionHandler } from "../create-transaction/create-transaction";

let moduleRef: TestingModule;
let createTransactionHandler: any

describe('CreateTransactionHandler', () => {
    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                CqrsModule,
            ],
            providers: [
                CreateTransactionHandler, TransactionInfrastructure,
                {
                    provide: 'TRANSACTION_MICROSERVICE',
                    useValue: {
                        emit: jest.fn().mockResolvedValueOnce({
                            value: 1000,
                        })
                    }
                }
            ]
        }).overrideProvider(TransactionInfrastructure)
            .useValue({
                saveTransaction: jest.fn().mockResolvedValueOnce({
                    value: 1000,
                    transactionExternalId: '123456789',
                    getTransactionExternalId: jest.fn().mockReturnValueOnce('123456789'),
                    getValue: jest.fn().mockReturnValueOnce(1000),
                })
            })
            .compile();
        createTransactionHandler = moduleRef.get<CreateTransactionHandler>(CreateTransactionHandler);
    });

    it('transaction created', async () => {
        const transaction = await createTransactionHandler.execute({
            accountExternalIdDebit: '123456789',
            accountExternalIdCredit: '987654321',
            tranferType: 1,
            value: 1000,
        });
        expect(transaction).toBeDefined();
        expect(transaction.message).toBe('Transaction created successfully');
    });
});