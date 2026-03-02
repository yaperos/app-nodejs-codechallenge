package com.yape.transaction.infrastructure.adapter.in.rest.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionResponse {

    private UUID transactionExternalId;
    private TransactionTypeDto transactionType;
    private TransactionStatusDto transactionStatus;
    private BigDecimal value;
    private LocalDateTime createdAt;

    public TransactionResponse() {
    }

    public TransactionResponse(UUID transactionExternalId, TransactionTypeDto transactionType,
                               TransactionStatusDto transactionStatus, BigDecimal value,
                               LocalDateTime createdAt) {
        this.transactionExternalId = transactionExternalId;
        this.transactionType = transactionType;
        this.transactionStatus = transactionStatus;
        this.value = value;
        this.createdAt = createdAt;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class TransactionTypeDto {
        private String name;

        public TransactionTypeDto() {
        }

        public TransactionTypeDto(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static class TransactionStatusDto {
        private String name;

        public TransactionStatusDto() {
        }

        public TransactionStatusDto(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
