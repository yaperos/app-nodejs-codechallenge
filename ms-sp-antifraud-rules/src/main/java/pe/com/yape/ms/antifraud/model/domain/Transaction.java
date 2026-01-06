package pe.com.yape.ms.antifraud.model.domain;

import java.time.LocalDateTime;

/**
 * Representa una transacción a validar usando Java 21 Record
 * @author lmarusic
 */
public record Transaction(
    String transactionId,
    String debitAccount,
    String creditAccount,
    double amount,
    int transferType,
    String status,
    String operationType,
    LocalDateTime sourceTimestamp
) {
    /**
     * Constructor compacto para validaciones
     */
    public Transaction {
        if (transactionId == null || transactionId.isBlank()) {
            throw new IllegalArgumentException("Transaction ID cannot be null or empty");
        }
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
    }

    /**
     * Verifica si el monto supera un umbral específico
     */
    public boolean amountExceeds(double threshold) {
        return amount > threshold;
    }

    /**
     * Verifica si el monto está dentro de un rango
     */
    public boolean amountWithinRange(double min, double max) {
        return amount >= min && amount <= max;
    }
}

