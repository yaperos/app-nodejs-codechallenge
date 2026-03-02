package com.yape.transaction.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Transaction {

    private final UUID transactionExternalId;
    private final UUID accountExternalIdDebit;
    private final UUID accountExternalIdCredit;
    private final TransactionType transactionType;
    private TransactionStatus transactionStatus;
    private final BigDecimal value;
    private final LocalDateTime createdAt;

    private Transaction(Builder builder) {
        this.transactionExternalId = builder.transactionExternalId;
        this.accountExternalIdDebit = builder.accountExternalIdDebit;
        this.accountExternalIdCredit = builder.accountExternalIdCredit;
        this.transactionType = builder.transactionType;
        this.transactionStatus = TransactionStatus.PENDING;
        this.value = builder.value;
        this.createdAt = LocalDateTime.now();
    }

    // Factory method - DDD style
    public static Transaction create(
            UUID accountExternalIdDebit,
            UUID accountExternalIdCredit,
            Integer transferTypeId,
            BigDecimal value) {

        return new Builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(accountExternalIdDebit)
                .accountExternalIdCredit(accountExternalIdCredit)
                .transactionType(TransactionType.fromId(transferTypeId))
                .value(value)
                .build();
    }

    public void approve() {
        this.transactionStatus = TransactionStatus.APPROVED;
    }

    public void reject() {
        this.transactionStatus = TransactionStatus.REJECTED;
    }

    public boolean isPending() {
        return TransactionStatus.PENDING.equals(this.transactionStatus);
    }

    // Getters
    public UUID getTransactionExternalId() { return transactionExternalId; }
    public UUID getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public UUID getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public TransactionType getTransactionType() { return transactionType; }
    public TransactionStatus getTransactionStatus() { return transactionStatus; }
    public BigDecimal getValue() { return value; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public static class Builder {
        private UUID transactionExternalId;
        private UUID accountExternalIdDebit;
        private UUID accountExternalIdCredit;
        private TransactionType transactionType;
        private BigDecimal value;

        public Builder transactionExternalId(UUID id) { this.transactionExternalId = id; return this; }
        public Builder accountExternalIdDebit(UUID id) { this.accountExternalIdDebit = id; return this; }
        public Builder accountExternalIdCredit(UUID id) { this.accountExternalIdCredit = id; return this; }
        public Builder transactionType(TransactionType type) { this.transactionType = type; return this; }
        public Builder value(BigDecimal value) { this.value = value; return this; }

        public Transaction build() { return new Transaction(this); }
    }
}
