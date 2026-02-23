package com.kafka.anti_fraude.application.usecase;

import com.kafka.anti_fraude.domain.command.TransactionValidationCommand;

public interface AntiFraudRuleUseCase {
    String applyRule(TransactionValidationCommand command);
}
