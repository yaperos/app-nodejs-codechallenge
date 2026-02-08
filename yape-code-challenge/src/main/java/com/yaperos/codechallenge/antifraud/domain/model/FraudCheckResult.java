package com.yaperos.codechallenge.antifraud.domain.model;

import com.yaperos.codechallenge.shared.event.TransactionStatusType;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
public class FraudCheckResult {

    private static final BigDecimal MAX_ALLOWED_VALUE = new BigDecimal("1000");

    private final UUID transactionExternalId;
    private final TransactionStatusType status;

    private FraudCheckResult(UUID transactionExternalId, TransactionStatusType status) {
        this.transactionExternalId = transactionExternalId;
        this.status = status;
    }

    public static FraudCheckResult evaluate(UUID transactionExternalId, BigDecimal value) {
        if (value.compareTo(MAX_ALLOWED_VALUE) > 0) {
            return new FraudCheckResult(transactionExternalId, TransactionStatusType.REJECTED);
        }
        return new FraudCheckResult(transactionExternalId, TransactionStatusType.APPROVED);
    }

}
