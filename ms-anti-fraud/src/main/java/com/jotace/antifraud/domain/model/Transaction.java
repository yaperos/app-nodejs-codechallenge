package com.jotace.antifraud.domain.model;

import java.time.Instant;
import java.util.UUID;

public record Transaction(
        UUID transactionExternalId,
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        int tranferTypeId,
        double value,
        String transactionStatus, // State field: tracks 'pending', 'approved', 'rejected'.
        Instant createdAt
) {
    // Constructor for creating a new Transaction. Initializes UUID, timestamp, and "pending" status.
    public Transaction(String accountExternalIdDebit, String accountExternalIdCredit, int tranferTypeId, double value) {
        this(
                UUID.randomUUID(),
                accountExternalIdDebit,
                accountExternalIdCredit,
                tranferTypeId,
                value,
                "pending",
                Instant.now()
        );
    }

    // Creates a NEW INSTANCE of the Record with the specified status.
    // Preserves immutability by returning a copy with the updated state field.
    public Transaction updateStatus(String newStatus) {
        return new Transaction(
                this.transactionExternalId(),
                this.accountExternalIdDebit(),
                this.accountExternalIdCredit(),
                this.tranferTypeId(),
                this.value(),
                newStatus,
                this.createdAt()
        );
    }
}