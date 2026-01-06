package pe.com.yape.ms.antifraud.model.domain;

import java.time.Instant;

/**
 * Representa el resultado de una validación antifraude
 * @author lmarusic
 */
public record TransactionValidation(
    String transactionId,
    ValidationStatus status,
    String reason,
    Instant validatedAt,
    double amount
) {

    public TransactionValidation {
        if (transactionId == null || transactionId.isBlank()) {
            throw new IllegalArgumentException("Transaction ID cannot be null or empty");
        }
        if (status == null) {
            throw new IllegalArgumentException("Validation status cannot be null");
        }
        if (validatedAt == null) {
            validatedAt = Instant.now();
        }
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
    }

    public static TransactionValidation approved(String transactionId, double amount) {
        return new TransactionValidation(
            transactionId,
            ValidationStatus.APPROVED,
            "Transaction amount is within acceptable limits",
            Instant.now(),
            amount
        );
    }

    public static TransactionValidation rejected(String transactionId, double amount, String reason) {
        return new TransactionValidation(
            transactionId,
            ValidationStatus.REJECTED,
            reason,
            Instant.now(),
            amount
        );
    }

    public boolean isApproved() {
        return status == ValidationStatus.APPROVED;
    }

    public boolean isRejected() {
        return status == ValidationStatus.REJECTED;
    }
}

