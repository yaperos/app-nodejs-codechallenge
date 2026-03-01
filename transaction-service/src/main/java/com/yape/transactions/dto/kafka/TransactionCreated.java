package com.yape.transactions.dto.kafka;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreated(
        UUID id,
        BigDecimal value
) {}