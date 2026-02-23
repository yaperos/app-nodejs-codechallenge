package com.kafka.anti_fraude.infrastructure.messaging.event;

import java.util.UUID;

public record TransactionCreatedEvent(
        UUID transactionExternalId,
        // UUID accountExternalIdDebit,
        // UUID accountExternalIdCredit,
        // Long transactionTypeId,
        // String transactionTypeName,
        double value
        // String status
        // LocalDateTime createdAt
) {}