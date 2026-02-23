package com.kafka.productor.infrastructure.controller.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.kafka.productor.domain.model.Transaction;

public record TransactionResponse(
        UUID transactionExternalId,
        TransactionTypeResponse transactionType,
        TransactionStatusResponse transactionStatus,
        double value,
        LocalDateTime createdAt
) {

    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getTransactionExternalId(),
                new TransactionTypeResponse(
                        transaction.getTransactionType().getName()
                ),
                new TransactionStatusResponse(
                        transaction.getStatus().name()
                ),
                transaction.getValue(),
                transaction.getCreatedAt()
        );
    }

    public record TransactionTypeResponse(String name) {}
    public record TransactionStatusResponse(String name) {}
}