package com.devpull.transactionservice.application.dto.result;

import com.devpull.transactionservice.domain.enums.TransactionStatus;
import com.devpull.transactionservice.domain.enums.TransactionType;

import java.time.Instant;
import java.util.UUID;

public record TransactionResult(
        UUID id,
        TransactionStatus status,
        TransactionType type,
        double amount,
        Instant createdAt,
        Instant updatedAt,
        UUID accountId
)
{}
