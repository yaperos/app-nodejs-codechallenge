package com.yape.risk.antifraud.application;

import com.yape.risk.antifraud.domain.FraudRuleEngine;
import com.yape.risk.antifraud.domain.RiskDecision;
import com.yape.risk.antifraud.infrastructure.kafka.dto.TransactionCreatedEvent;
import com.yape.risk.antifraud.infrastructure.kafka.dto.TransactionValidatedEvent;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AntifraudEvaluationService {

    private final FraudRuleEngine ruleEngine;

    public AntifraudEvaluationService(FraudRuleEngine ruleEngine) {
        this.ruleEngine = ruleEngine;
    }

    public TransactionValidatedEvent evaluate(TransactionCreatedEvent event) {

        RiskDecision decision = ruleEngine.evaluate(event);

        TransactionValidatedEvent result = new TransactionValidatedEvent();
        result.setEventId(UUID.randomUUID());
        result.setTransactionExternalId(event.getTransactionExternalId());
        result.setResult(decision.name());
        result.setReason(decision == RiskDecision.APPROVED ? "OK" : "Risk rule triggered");
        result.setEvaluatedAt(OffsetDateTime.now());

        return result;
    }
}