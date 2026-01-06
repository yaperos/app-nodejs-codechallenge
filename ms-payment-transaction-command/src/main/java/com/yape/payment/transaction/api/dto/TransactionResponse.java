package com.yape.payment.transaction.api.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class TransactionResponse {

    private UUID transactionExternalId;
    private TransactionTypeDto transactionType;
    private TransactionStatusDto transactionStatus;
    private BigDecimal value;
    private OffsetDateTime createdAt;

    public UUID getTransactionExternalId() {
        return transactionExternalId;
    }

    public void setTransactionExternalId(UUID transactionExternalId) {
        this.transactionExternalId = transactionExternalId;
    }

    public TransactionTypeDto getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionTypeDto transactionType) {
        this.transactionType = transactionType;
    }

    public TransactionStatusDto getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(TransactionStatusDto transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
