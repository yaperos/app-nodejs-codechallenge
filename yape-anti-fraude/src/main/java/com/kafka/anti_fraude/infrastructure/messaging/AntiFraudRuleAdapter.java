package com.kafka.anti_fraude.infrastructure.messaging;

import org.springframework.stereotype.Component;

import com.kafka.anti_fraude.application.usecase.AntiFraudRuleUseCase;
import com.kafka.anti_fraude.domain.command.TransactionValidationCommand;

@Component
public class AntiFraudRuleAdapter implements AntiFraudRuleUseCase {

    private static final double VALUE = 1000.0;

    @Override
    public String applyRule(TransactionValidationCommand command) {
        return (command.value() > VALUE) ? "REJECTED" : "APPROVED";
    }
}
