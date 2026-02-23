package com.kafka.productor.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Transaction {
    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private TransactionType transactionType;
    private TransactionStatus status;
    private double value;
    private LocalDateTime createdAt;

    public Transaction() {
    }

    public Transaction(UUID transactionExternalId, double value) {
        this.transactionExternalId = transactionExternalId;
        this.value = value;
    }

    public Transaction(
            UUID transactionExternalId,
            UUID accountExternalIdDebit,
            UUID accountExternalIdCredit,
            TransactionType transactionType,
            double value) {
        this.transactionExternalId = transactionExternalId;
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.transactionType = transactionType;
        this.value = value;
        this.status = TransactionStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public void approve() {
        this.status = TransactionStatus.APPROVED;
    }

    public void reject() {
        this.status = TransactionStatus.REJECTED;
    }

    public void updateStatus(TransactionStatus status) {
        this.status = status;
    }
}
