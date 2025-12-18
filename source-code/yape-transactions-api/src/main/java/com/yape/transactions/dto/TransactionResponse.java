package com.yape.transactions.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionResponse(
        UUID transactionExternalId,
        TransactionStatusDto transactionStatus,
        BigDecimal value,
        Instant createdAt
) {
    public record TransactionStatusDto(String name) {}
}
