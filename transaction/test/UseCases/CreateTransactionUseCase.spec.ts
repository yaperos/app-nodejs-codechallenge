import {CreateTransactionUseCase} from "../../src/Transaction/Application/UseCases/CreateTransactionUseCase";
import {TransactionRepositoryInterface} from "../../src/Transaction/Domain/Repositories/TransactionRepositoryInterface";
import {TransactionEventInterface} from "../../src/Transaction/Domain/Events/TransactionEventInterface";
import {CreateTransactionDto} from "../../src/Transaction/Domain/Dtos/CreateTransactionDto";

describe('CreateTransactionUseCase', () => {
    let useCase: CreateTransactionUseCase;
    let mockTransactionRepository: Partial<TransactionRepositoryInterface>;
    let mockEventPublisher: Partial<TransactionEventInterface>;

    beforeEach(() => {
        mockTransactionRepository = {
            create: jest.fn().mockResolvedValue({
                id: 'tx-123',
                transferTypeName: 'Inmediata',
                status: 'pending',
                value: 100,
                createdAt: new Date('2025-08-11T00:00:00Z'),
            }),
        };

        mockEventPublisher = {
            publishTransactionCreated: jest.fn().mockResolvedValue(undefined),
        };

        useCase = new CreateTransactionUseCase(
            mockTransactionRepository as TransactionRepositoryInterface,
            mockEventPublisher as TransactionEventInterface,
        );
    });

    it('should create transaction and publish event', async () => {
        const transactionData: CreateTransactionDto = {
            accountExternalIdDebit: 'a776761c-f6f8-4931-9f5c-31ef7a9fe4d2',
            accountExternalIdCredit: 'a776761c-f6f8-4931-9f5c-31ef7a9fe4d2',
            transferTypeId: 'a776761c-f6f8-4931-9f5c-31ef7a9fe4d2',
            value: 100,
        };

        const result = await useCase.execute(transactionData);

        expect(mockEventPublisher.publishTransactionCreated).toHaveBeenCalledWith(expect.objectContaining({
            id: 'tx-123',
            status: 'pending',
            value: 100,
        }));

        expect(result).toEqual({
            transactionExternalId: 'tx-123',
            transactionType: { name: 'Inmediata' },
            transactionStatus: { name: 'pending' },
            value: 100,
            createdAt: new Date('2025-08-11T00:00:00Z'),
        });
    });
});
