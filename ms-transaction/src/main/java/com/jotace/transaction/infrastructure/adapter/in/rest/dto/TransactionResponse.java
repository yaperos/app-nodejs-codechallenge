package com.jotace.transaction.infrastructure.adapter.in.rest.dto;

import com.jotace.transaction.domain.model.Transaction;

import java.time.Instant;
import java.util.UUID;

// Public Record for the standardized response format.
public record TransactionResponse(
        UUID transactionExternalId,
        TransactionType transactionType,
        TransactionStatus transactionStatus,
        double value,
        Instant createdAt
) {
    // Inner Record representing the nested transactionType object
    public record TransactionType(int name) {}

    // Inner Record representing the nested transactionStatus object
    public record TransactionStatus(String name) {}

    //
    public static TransactionResponse fromDomain(Transaction transaction) {
        return new TransactionResponse(
                transaction.transactionExternalId(),
                new TransactionType(transaction.tranferTypeId()),
                new TransactionStatus(transaction.transactionStatus()),
                transaction.value(),
                transaction.createdAt()
        );
    }
}
