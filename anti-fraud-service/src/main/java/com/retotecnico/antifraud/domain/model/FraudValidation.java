package com.retotecnico.antifraud.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Domain model representing a fraud validation result.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudValidation {

    private static final BigDecimal MAX_ALLOWED_VALUE = new BigDecimal("1000");

    private UUID transactionExternalId;
    private BigDecimal transactionValue;
    private String resultStatus;

    /**
     * Core business rule: transactions > 1000 are rejected.
     */
    public static FraudValidation validate(UUID transactionExternalId, BigDecimal value) {
        String status = value.compareTo(MAX_ALLOWED_VALUE) > 0 ? "REJECTED" : "APPROVED";

        return FraudValidation.builder()
                .transactionExternalId(transactionExternalId)
                .transactionValue(value)
                .resultStatus(status)
                .build();
    }
}
