package com.yape.risk.antifraud.domain;

import com.yape.risk.antifraud.infrastructure.kafka.dto.TransactionCreatedEvent;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class FraudRuleEngine {

    public RiskDecision evaluate(TransactionCreatedEvent event) {

        if (event.getValue() == null) {
            return RiskDecision.REJECTED;
        }

        // regla 1000
        if (event.getValue().compareTo(new BigDecimal("1000")) > 0) {
            return RiskDecision.REJECTED;
        }

        return RiskDecision.APPROVED;
    }
}