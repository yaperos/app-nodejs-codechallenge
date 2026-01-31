package com.devpull.antifraudservice.dto;

import com.devpull.antifraudservice.enums.TransactionStatus;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record TransactionStatusChangedEvent(
        @NotNull UUID transactionId,
        @NotNull TransactionStatus status,
        Instant evaluatedAt,
        String reason
) {
}
