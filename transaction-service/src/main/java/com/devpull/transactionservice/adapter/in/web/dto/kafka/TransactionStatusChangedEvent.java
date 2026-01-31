package com.devpull.transactionservice.adapter.in.web.dto.kafka;

import java.time.Instant;
import java.util.UUID;

public record TransactionStatusChangedEvent(
        UUID transactionId,
        String status,
        Instant evaluatedAt,
        String reason
) {}
