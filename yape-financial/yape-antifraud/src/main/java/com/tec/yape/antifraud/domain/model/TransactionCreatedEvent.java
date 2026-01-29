package com.tec.yape.antifraud.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreatedEvent(
        UUID transactionExternalId,
        BigDecimal value
) {}
