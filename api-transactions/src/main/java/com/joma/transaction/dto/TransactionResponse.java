package com.joma.transaction.dto;

import java.time.Instant;

public record TransactionResponse(
        String transactionExternalId,
        String transactionName,
        Instant createdAt
) {
}
