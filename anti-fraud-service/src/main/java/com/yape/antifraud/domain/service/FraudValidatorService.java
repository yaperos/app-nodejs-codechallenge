package com.yape.antifraud.domain.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Servicio de validación anti-fraude
 */
@Slf4j
@Service
public class FraudValidatorService {

    @Value("${anti-fraud.max-transaction-value}")
    private BigDecimal maxTransactionValue;

    /**
     * Valida si una transacción es fraudulenta
     * Regla: Si el valor es mayor a 1000, se rechaza
     */
    public ValidationResult validate(UUID transactionId, BigDecimal transactionValue) {
        log.info("Validating transaction {} with value: {}", transactionId, transactionValue);

        if (transactionValue.compareTo(maxTransactionValue) > 0) {
            log.warn("Transaction {} REJECTED - Value {} exceeds threshold {}",
                    transactionId, transactionValue, maxTransactionValue);
            return ValidationResult.rejected(
                    String.format("Transaction value %.2f exceeds fraud threshold (%.2f)",
                            transactionValue, maxTransactionValue)
            );
        }

        log.info("Transaction {} APPROVED - Value {} is within threshold",
                transactionId, transactionValue);
        return ValidationResult.approved("Transaction passed fraud validation");
    }

    /**
     * Resultado de la validación
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class ValidationResult {
        private String status; // "approved" or "rejected"
        private String reason;

        public static ValidationResult approved(String reason) {
            return new ValidationResult("approved", reason);
        }

        public static ValidationResult rejected(String reason) {
            return new ValidationResult("rejected", reason);
        }
    }
}

