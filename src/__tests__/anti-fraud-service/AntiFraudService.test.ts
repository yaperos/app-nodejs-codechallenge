import { AntiFraudService } from '../../anti-fraud-service/application/AntiFraudService';
import { TransactionStatusProducer } from '../../anti-fraud-service/infrastructure/kafka/TransactionStatusProducer';

describe('AntiFraudService', () => {
    let antiFraudService: AntiFraudService;
    let mockTransactionStatusProducer: TransactionStatusProducer;

    beforeEach(() => {
        mockTransactionStatusProducer = {
            publish: jest.fn()
        } as unknown as TransactionStatusProducer;

        antiFraudService = new AntiFraudService(mockTransactionStatusProducer);
    });

    it('debería aprobar transacción con monto menor o igual a 1000', async () => {
        const transactionData = { id: '1', value: 500 };

        antiFraudService.evaluateTransaction(transactionData);

        expect(mockTransactionStatusProducer.publish).toHaveBeenCalledWith('1', 'approved');
    });

    it('debería rechazar transacción con monto mayor a 1000', async () => {
        const transactionData = { id: '2', value: 1500 };

        antiFraudService.evaluateTransaction(transactionData);

        expect(mockTransactionStatusProducer.publish).toHaveBeenCalledWith('2', 'rejected');
    });

    it('debería manejar errores cuando falten datos', async () => {
        const invalidTransactionData = {};
    
        await expect(antiFraudService.evaluateTransaction(invalidTransactionData))
            .rejects.toThrow('Datos incompletos');
    });
    
});
