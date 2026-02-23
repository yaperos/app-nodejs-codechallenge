package com.kafka.productor.infrastructure.messaging.event;

import java.util.UUID;

public record TransactionStatusUpdatedEvent(
    UUID transactionExternalId,
    String status) {
}