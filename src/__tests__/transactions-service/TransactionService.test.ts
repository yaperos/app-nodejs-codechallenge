import { TransactionService } from '../../transactions-service/application/TransactionService';
import { Transaction } from '../../transactions-service/domain/Transaction';
import { ITransactionRepository } from '../../transactions-service/domain/ITransactionRepository';

class MockTransactionRepository implements ITransactionRepository {
    create = jest.fn();
    getById = jest.fn();
    updateTransactionStatus = jest.fn();
}

jest.setTimeout(3000);  

describe('TransactionService', () => {
    let transactionService: TransactionService;
    let mockRepository: MockTransactionRepository;

    beforeEach(() => {
        mockRepository = new MockTransactionRepository();
        transactionService = new TransactionService(mockRepository);
    });

    it('debería crear una transacción correctamente', async () => {
        const transactionData = {
            id: '1',
            accountExternalIdDebit: '123',
            accountExternalIdCredit: '456',
            tranferTypeId: 1,
            value: 100
        };

        const createdTransaction = new Transaction(
            transactionData.id,
            transactionData.accountExternalIdDebit,
            transactionData.accountExternalIdCredit,
            transactionData.tranferTypeId,
            transactionData.value,
            'pending'
        );

        mockRepository.create.mockResolvedValue(createdTransaction);

        const result = await transactionService.createTransaction(transactionData);

        expect(result).toEqual(createdTransaction);
        expect(mockRepository.create).toHaveBeenCalledWith(createdTransaction);
    });

    it('debería lanzar un error si el monto es inválido', async () => {
        const transactionData = {
            id: '2',
            accountExternalIdDebit: '123',
            accountExternalIdCredit: '456',
            tranferTypeId: 1,
            value: -100
        };

        await expect(transactionService.createTransaction(transactionData))
            .rejects
            .toThrow('El monto de la transacción debe ser mayor que cero.');
    });
});
