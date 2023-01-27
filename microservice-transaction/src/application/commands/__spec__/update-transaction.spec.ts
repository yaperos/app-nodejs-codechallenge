import { CqrsModule } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";
import { TransactionInfrastructure } from "../../../../src/infrastructure/transaction.infrastructure";
import { UpdateTransactionHandler } from "../update-status-transaction/update-status-transaction";

let moduleRef: TestingModule;
let updateTransactionHandler: any

describe('UpdateTransactionHandler', () => {
    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                CqrsModule,
            ],
            providers: [
                UpdateTransactionHandler, TransactionInfrastructure,
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
                }),
                getTransactionById: jest.fn().mockResolvedValueOnce({
                    value: 1000,
                    transactionExternalId: '123456789',
                    setStatus: jest.fn(),
                    getTransactionExternalId: jest.fn().mockReturnValueOnce('123456789'),
                    getValue: jest.fn().mockReturnValueOnce(1000),
                })
            })
            .compile();
        updateTransactionHandler = moduleRef.get<UpdateTransactionHandler>(UpdateTransactionHandler);
    });

    it('transaction updated', async () => {
        const transaction = await updateTransactionHandler.execute({
            transactionExternalId: '123456789',
            status: '1',
        });
        expect(transaction).toBeDefined();
        expect(transaction.message).toBe('Transaction updated successfully');
    });
});
