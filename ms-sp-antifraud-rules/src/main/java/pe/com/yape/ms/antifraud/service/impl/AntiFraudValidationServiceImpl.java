package pe.com.yape.ms.antifraud.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.com.yape.ms.antifraud.model.domain.Transaction;
import pe.com.yape.ms.antifraud.model.domain.TransactionRisk;
import pe.com.yape.ms.antifraud.model.domain.TransactionValidation;
import pe.com.yape.ms.antifraud.service.AntiFraudValidationService;

/**
 * Implementación del servicio de validación antifraud
 * @author lmarusic
 */
@Service
@Slf4j
public class AntiFraudValidationServiceImpl implements AntiFraudValidationService {

    private static final double HIGH_VALUE_THRESHOLD = 1000.0;
    private static final String REJECTION_REASON_HIGH_VALUE = 
        "Transaction rejected: amount exceeds maximum allowed value of " + HIGH_VALUE_THRESHOLD;

    @Override
    public TransactionValidation validate(Transaction transaction) {
        log.info("Validating transaction: {} with amount: {}", 
            transaction.transactionId(), transaction.amount());

        return switch (evaluateTransaction(transaction)) {
            case LOW -> {
                log.info("Transaction {} APPROVED - Low risk", transaction.transactionId());
                yield TransactionValidation.approved(transaction.transactionId(),transaction.amount());
            }
            case HIGH -> {
                log.warn("Transaction {} REJECTED - High risk: amount > {}", 
                    transaction.transactionId(), HIGH_VALUE_THRESHOLD);
                yield TransactionValidation.rejected(transaction.transactionId(), transaction.amount(),
                    REJECTION_REASON_HIGH_VALUE
                );
            }
        };
    }

    private TransactionRisk evaluateTransaction(Transaction transaction) {
        return transaction.amount() > HIGH_VALUE_THRESHOLD 
            ? TransactionRisk.HIGH 
            : TransactionRisk.LOW;
    }
}
