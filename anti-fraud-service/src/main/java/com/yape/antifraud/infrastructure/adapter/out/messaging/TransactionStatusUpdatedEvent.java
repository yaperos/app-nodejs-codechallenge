package com.yape.antifraud.infrastructure.adapter.out.messaging;

public record TransactionStatusUpdatedEvent(
        String transactionExternalId,
        String status
) {}
