package com.kafka.productor.infrastructure.messaging.kafka;

import java.util.UUID;

import com.kafka.productor.domain.model.Transaction;

public record TransactionCreatedEvent(
        UUID transactionExternalId,
        double value) {

    public static TransactionCreatedEvent from(Transaction transaction) {
        return new TransactionCreatedEvent(
                transaction.getTransactionExternalId(),
                transaction.getValue());
    }
}