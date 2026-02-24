package com.yape.transaction_service.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record GetTransactionResponse(
        UUID transactionExternalId,
        TransactionType transactionType,
        TransactionStatusResponse transactionStatus,
        BigDecimal value,
        LocalDateTime createdAt
) {

    public record TransactionType(String name) {}
    public record TransactionStatusResponse(String name) {}
}
