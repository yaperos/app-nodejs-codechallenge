package com.yape.codechallenge.event;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionEvent(
        UUID transactionExternalId,
        BigDecimal value,
        String status) {
}
