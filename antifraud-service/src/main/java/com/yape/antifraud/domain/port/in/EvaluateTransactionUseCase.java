package com.yape.antifraud.domain.port.in;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Input port for evaluating a transaction against anti-fraud rules.
 * Returns "APPROVED" if the transaction passes validation, or "REJECTED" otherwise.
 */
public interface EvaluateTransactionUseCase {

    /**
     * Evaluates a transaction based on its value.
     *
     * @param transactionId the unique identifier of the transaction
     * @param value         the monetary value of the transaction
     * @return "APPROVED" if value <= 1000, "REJECTED" if value > 1000
     */
    String evaluate(UUID transactionId, BigDecimal value);
}
