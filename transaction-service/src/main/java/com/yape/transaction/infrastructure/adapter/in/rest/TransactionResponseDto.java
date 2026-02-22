package com.yape.transaction.infrastructure.adapter.in.rest;

import com.yape.transaction.domain.model.Transaction;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionResponseDto(
        UUID transactionExternalId,
        TransactionTypeResponse transactionType,
        TransactionStatusResponse transactionStatus,
        BigDecimal value,
        LocalDateTime createdAt
) {
    public record TransactionTypeResponse(String name) {}
    public record TransactionStatusResponse(String name) {}

    public static TransactionResponseDto from(Transaction transaction) {
        return new TransactionResponseDto(
                transaction.getId(),
                new TransactionTypeResponse(transaction.getTransferTypeName()),
                new TransactionStatusResponse(transaction.getStatus().getValue()),
                transaction.getValue(),
                transaction.getCreatedAt()
        );
    }
}
