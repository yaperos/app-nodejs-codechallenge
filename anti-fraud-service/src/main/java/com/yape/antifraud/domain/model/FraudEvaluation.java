package com.yape.antifraud.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

public class FraudEvaluation {

    private static final BigDecimal MAX_ALLOWED_VALUE = BigDecimal.valueOf(1000);

    private final UUID transactionExternalId;
    private final BigDecimal value;
    private FraudResult result;

    public FraudEvaluation(UUID transactionExternalId, BigDecimal value) {
        this.transactionExternalId = transactionExternalId;
        this.value = value;
    }

    /**
     * Core business rule: transactions over 1000 are rejected
     * This is a pure domain method — no infrastructure concerns
     */
    public FraudEvaluation evaluate() {
        this.result = value.compareTo(MAX_ALLOWED_VALUE) > 0
                ? FraudResult.REJECTED
                : FraudResult.APPROVED;
        return this;
    }

    public UUID getTransactionExternalId() { return transactionExternalId; }
    public BigDecimal getValue() { return value; }
    public FraudResult getResult() { return result; }
    public boolean isApproved() { return FraudResult.APPROVED.equals(result); }
    public boolean isRejected() { return FraudResult.REJECTED.equals(result); }
}
