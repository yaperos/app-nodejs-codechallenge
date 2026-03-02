package com.yape.transaction.infrastructure.adapter.in.messaging;

public record TransactionStatusUpdatedEvent(
        String transactionExternalId,
        String status
) {}
