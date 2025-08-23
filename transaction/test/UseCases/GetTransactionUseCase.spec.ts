import {GetTransactionUseCase} from "../../src/Transaction/Application/UseCases/GetTransactionUseCase";
import {TransactionRepositoryInterface} from "../../src/Transaction/Domain/Repositories/TransactionRepositoryInterface";
import {TransactionNotFoundException} from "../../src/Transaction/Domain/Exceptions/TransactionNotFoundException";

describe('GetTransactionUseCase', () => {
    let useCase: GetTransactionUseCase;
    let mockTransactionRepository: Partial<TransactionRepositoryInterface>;

    beforeEach(() => {
        mockTransactionRepository = {
            findById: jest.fn(),
        };

        useCase = new GetTransactionUseCase(
            mockTransactionRepository as TransactionRepositoryInterface
        );
    });

    it('should return transaction data when found', async () => {
        const transactionData = {
            id: 'tx-123',
            transferTypeName: 'Inmediata',
            status: 'completed',
            value: 200,
            createdAt: new Date('2025-08-11T00:00:00Z'),
        };
        (mockTransactionRepository.findById as jest.Mock).mockResolvedValue(transactionData);

        const result = await useCase.execute('tx-123');

        expect(mockTransactionRepository.findById).toHaveBeenCalledWith('tx-123');
        expect(result).toEqual({
            transactionExternalId: 'tx-123',
            transactionType: { name: 'Inmediata' },
            transactionStatus: { name: 'completed' },
            value: 200,
            createdAt: new Date('2025-08-11T00:00:00Z'),
        });
    });

    it('should throw TransactionNotFoundException when transaction not found', async () => {
        (mockTransactionRepository.findById as jest.Mock).mockResolvedValue(null);

        await expect(useCase.execute('non-existent-id')).rejects.toThrow(TransactionNotFoundException);
        expect(mockTransactionRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });
});
