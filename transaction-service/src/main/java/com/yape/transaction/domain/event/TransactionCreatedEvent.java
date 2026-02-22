package com.yape.transaction.domain.event;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreatedEvent(
        UUID transactionId,
        BigDecimal value
) {}
