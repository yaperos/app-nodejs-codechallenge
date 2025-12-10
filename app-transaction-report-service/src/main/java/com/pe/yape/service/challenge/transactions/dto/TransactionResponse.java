package com.pe.yape.service.challenge.transactions.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
            String transactionExternalId,
            TransactionType transactionType,
            TransactionStatus transactionStatus,
            BigDecimal value,
            LocalDateTime createdAt
    ) {}



