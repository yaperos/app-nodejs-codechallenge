package com.yape.shared;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreatedEvent(
        UUID transactionExternalId,
        BigDecimal value
) {}
