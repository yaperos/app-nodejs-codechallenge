package com.yape.transaction.infrastructure.adapter.out.kafka;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreatedMessage(
        UUID transactionId,
        BigDecimal value
) {}
