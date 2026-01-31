package com.devpull.transactionservice.domain.model;

import com.devpull.transactionservice.domain.enums.TransactionStatus;
import com.devpull.transactionservice.domain.enums.TransactionType;
import lombok.Getter;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Getter
public class Transaction {

    private final UUID id;
    private TransactionStatus status;
    private final TransactionType type;
    private final double amount;
    private final Instant createdAt;
    private final Instant updatedAt;
    private final UUID accountId;

    private Transaction(UUID id, TransactionStatus status, TransactionType type, double amount,
                        Instant createdAt, Instant updatedAt, UUID accountId) {
        this.id = Objects.requireNonNull(id);
        this.status = Objects.requireNonNull(status);
        this.type = Objects.requireNonNull(type);
        if (amount <= 0) throw new IllegalArgumentException("amount must be > 0");
        this.amount = amount;
        this.createdAt = Objects.requireNonNull(createdAt);
        this.updatedAt = Objects.requireNonNull(updatedAt);
        this.accountId = Objects.requireNonNull(accountId);
    }

    public static Transaction createNew(UUID accountId, TransactionType type, double amount) {
        Instant now = Instant.now();
        return new Transaction(UUID.randomUUID(), TransactionStatus.PENDING, type, amount, now, now, accountId);
    }

    public static Transaction rehydrate(UUID id, TransactionStatus status, TransactionType type, double amount,
                                        Instant createdAt, Instant updatedAt, UUID accountId) {
        return new Transaction(id, status, type, amount, createdAt, updatedAt, accountId);
    }

    public void setStatus(TransactionStatus status) {
        this.status = Objects.requireNonNull(status);
    }

}
