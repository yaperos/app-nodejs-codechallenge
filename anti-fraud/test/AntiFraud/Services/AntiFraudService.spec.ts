import {AntiFraudService} from "../../../src/AntiFraud/Domain/Services/AntiFraudService";
import {MessageTransactionModel} from "../../../src/AntiFraud/Domain/Models/MessageTransactionModel";
import {VALIDATION_ANTI_FRAUD_STATUS} from "../../../src/AntiFraud/Domain/Constants/CommonConstants";

describe('AntiFraudService', () => {
    let service: AntiFraudService;

    beforeEach(() => {
        service = new AntiFraudService();
    });

    it('should reject transaction with value <= 0', () => {
        const transaction = new MessageTransactionModel('tx-123', 0);

        const result = service.validate(transaction);

        expect(result.status).toBe(VALIDATION_ANTI_FRAUD_STATUS.REJECTED);
        expect(result.transactionExternalId).toBe(transaction.transactionExternalId);
        expect(result.reason).toBe('invalid_value');
    });

    it('should reject transaction with value > 1000', () => {
        const transaction = new MessageTransactionModel('tx-456', 1500);

        const result = service.validate(transaction);

        expect(result.status).toBe(VALIDATION_ANTI_FRAUD_STATUS.REJECTED);
        expect(result.transactionExternalId).toBe(transaction.transactionExternalId);
        expect(result.reason).toBe('value_exceeds_limit');
    });

    it('should approve transaction with value between 0 and 1000', () => {
        const transaction = new MessageTransactionModel('tx-789', 500);

        const result = service.validate(transaction);

        expect(result.status).toBe(VALIDATION_ANTI_FRAUD_STATUS.APPROVED);
        expect(result.transactionExternalId).toBe(transaction.transactionExternalId);
        expect(result.reason).toBeUndefined(); // Asumo que approved no tiene reason
    });
});
