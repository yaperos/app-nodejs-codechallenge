package com.kafka.anti_fraude.infrastructure.messaging.dto;

import java.util.UUID;

public record TransactionUpdatedEvent(
    UUID transactionExternalId,
    String status
) {}
