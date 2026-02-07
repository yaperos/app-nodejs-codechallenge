package com.yape.codechallenge.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.yape.codechallenge.enums.TransactionStatus;
import com.yape.codechallenge.enums.TransactionType;

public record TransactionResponse(
                UUID transactionExternalId,
                TransactionType transactionType,
                TransactionStatus transactionStatus,
                BigDecimal value,
                LocalDateTime createdAt) {
}
