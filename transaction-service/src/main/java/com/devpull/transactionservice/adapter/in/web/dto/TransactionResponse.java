package com.devpull.transactionservice.adapter.in.web.dto;

import com.devpull.transactionservice.domain.enums.TransactionStatus;
import com.devpull.transactionservice.domain.enums.TransactionType;

import java.time.Instant;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        TransactionStatus status,
        TransactionType type,
        double amount,
        Instant createdAt,
        Instant updatedAt,
        UUID accountId
) {}
