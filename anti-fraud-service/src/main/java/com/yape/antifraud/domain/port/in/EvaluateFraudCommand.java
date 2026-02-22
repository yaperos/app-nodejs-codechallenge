package com.yape.antifraud.domain.port.in;

import java.math.BigDecimal;
import java.util.UUID;

public record EvaluateFraudCommand(
        UUID transactionId,
        BigDecimal value
) {}
