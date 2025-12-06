package com.jotace.transaction.infrastructure.adapter.in.consumer;

import java.util.UUID;

public record TransactionStatusUpdatedEvent(
        UUID transactionExternalId,
        String newStatus
) {}

