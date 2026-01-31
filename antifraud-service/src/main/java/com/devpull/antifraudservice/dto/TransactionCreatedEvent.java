package com.devpull.antifraudservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record TransactionCreatedEvent(
        @NotNull UUID transactionId,
        @NotNull UUID accountId,
        @NotNull String type,
        @NotNull @Positive Double amount
) {
}
