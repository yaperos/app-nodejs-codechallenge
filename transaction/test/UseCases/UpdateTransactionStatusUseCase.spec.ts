import {
    UpdateTransactionStatusUseCase
} from "../../src/Transaction/Application/UseCases/UpdateTransactionStatusUseCase";
import {TransactionRepositoryInterface} from "../../src/Transaction/Domain/Repositories/TransactionRepositoryInterface";
import {Transaction} from "../../src/Transaction/Domain/Entities/Transaction";


describe('UpdateTransactionStatusUseCase', () => {
    let useCase: UpdateTransactionStatusUseCase;
    let mockTransactionRepository: Partial<TransactionRepositoryInterface>;

    beforeEach(() => {
        mockTransactionRepository = {
            updateStatus: jest.fn(),
        };

        useCase = new UpdateTransactionStatusUseCase(
            mockTransactionRepository as TransactionRepositoryInterface
        );
    });

    it('should update transaction status and return updated transaction', async () => {
        const updatedTransaction = {
            id: 'a776761c-f6f8-4931-9f5c-31ef7a9fe4d2',
            accountExternalIdDebit: 'a776761c-f6f8-4931-9f5c-31ef7a9fe4d2',
            accountExternalIdCredit: 'a776761c-f6f8-4931-9f5c-31ef7a9fe4d2',
            transferTypeId: 'a776761c-f6f8-4931-9f5c-31ef7a9fe4d2',
            value: 100,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        } as Transaction;

        (mockTransactionRepository.updateStatus as jest.Mock).mockResolvedValue(updatedTransaction);

        const result = await useCase.execute('tx-123', 'pending');

        expect(mockTransactionRepository.updateStatus).toHaveBeenCalledWith('tx-123', 'pending');
        expect(result).toEqual(updatedTransaction);
    });
});
