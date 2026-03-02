package com.yape.antifraud.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

public class TransactionToValidate {

    private UUID transactionExternalId;
    private BigDecimal value;

    public TransactionToValidate() {
    }

    public TransactionToValidate(UUID transactionExternalId, BigDecimal value) {
        this.transactionExternalId = transactionExternalId;
        this.value = value;
    }

    public UUID getTransactionExternalId() {
        return transactionExternalId;
    }

    public void setTransactionExternalId(UUID transactionExternalId) {
        this.transactionExternalId = transactionExternalId;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}
