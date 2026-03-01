package com.yape.transactions.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TransactionResponse(
        UUID transactionExternalId,
        TransactionTypeResponse transactionType,
        TransactionStatusResponse transactionStatus,
        BigDecimal value,
        OffsetDateTime createdAt
) {}

