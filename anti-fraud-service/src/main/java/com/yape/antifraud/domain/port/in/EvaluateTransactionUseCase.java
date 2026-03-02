package com.yape.antifraud.domain.port.in;

import com.yape.antifraud.domain.model.FraudEvaluation;

import java.math.BigDecimal;
import java.util.UUID;

public interface EvaluateTransactionUseCase {

    FraudEvaluation execute(Command command);

    record Command(UUID transactionExternalId, BigDecimal value) {}
}
