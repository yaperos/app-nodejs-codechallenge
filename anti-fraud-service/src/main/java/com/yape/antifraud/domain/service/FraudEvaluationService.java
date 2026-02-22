package com.yape.antifraud.domain.service;

import com.yape.antifraud.domain.model.FraudEvaluation;

import java.math.BigDecimal;
import java.util.UUID;

public class FraudEvaluationService {

    private static final BigDecimal MAX_ALLOWED_VALUE = new BigDecimal("1000");

    public FraudEvaluation evaluate(UUID transactionId, BigDecimal value) {
        boolean isFraudulent = value.compareTo(MAX_ALLOWED_VALUE) > 0;
        String status = isFraudulent ? FraudEvaluation.REJECTED : FraudEvaluation.APPROVED;
        return new FraudEvaluation(transactionId, value, status);
    }
}
