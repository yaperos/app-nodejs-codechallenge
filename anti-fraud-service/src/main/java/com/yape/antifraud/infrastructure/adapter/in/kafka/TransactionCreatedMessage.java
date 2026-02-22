package com.yape.antifraud.infrastructure.adapter.in.kafka;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreatedMessage(UUID transactionId, BigDecimal value) {}
