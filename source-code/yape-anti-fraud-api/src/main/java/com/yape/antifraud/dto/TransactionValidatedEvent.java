package com.yape.antifraud.dto;

import java.time.Instant;
import java.util.UUID;

public record TransactionValidatedEvent(
        UUID transactionExternalId,
        String status,
        String reason,
        Instant validatedAt
) {}
