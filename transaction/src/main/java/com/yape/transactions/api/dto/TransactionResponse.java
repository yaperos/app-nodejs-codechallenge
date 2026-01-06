package com.yape.transactions.api.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record TransactionResponse(
    String transactionExternalId,
    NamedDto transactionType,
    NamedDto transactionStatus,
    BigDecimal value,
    Instant createdAt
) {
  public record NamedDto(String name) {}
}
