package com.jotace.antifraud.infrastructure.adapter.out;

import java.util.UUID;

public record TransactionStatusUpdatedEvent(
        UUID transactionExternalId,
        String newStatus
) {}
