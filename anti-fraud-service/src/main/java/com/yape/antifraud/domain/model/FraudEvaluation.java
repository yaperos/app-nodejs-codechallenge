package com.yape.antifraud.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

public record FraudEvaluation(
        UUID transactionId,
        BigDecimal value,
        String status
) {
    public static final String APPROVED = "approved";
    public static final String REJECTED = "rejected";

    public boolean isApproved() {
        return APPROVED.equals(status);
    }
}
