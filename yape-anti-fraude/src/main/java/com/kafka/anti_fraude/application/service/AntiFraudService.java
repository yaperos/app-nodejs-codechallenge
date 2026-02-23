package com.kafka.anti_fraude.application.service;

import org.springframework.stereotype.Service;

import com.kafka.anti_fraude.application.usecase.AntiFraudRuleUseCase;
import com.kafka.anti_fraude.application.usecase.TransactionPublisherUseCase;
import com.kafka.anti_fraude.application.usecase.ValidateTransactionUseCase;
import com.kafka.anti_fraude.domain.command.TransactionValidationCommand;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AntiFraudService implements ValidateTransactionUseCase {

    private final AntiFraudRuleUseCase antiFraudRule;

    private final TransactionPublisherUseCase statusPublisher;

    @Override
    public void execute(TransactionValidationCommand command) {
        String newStatus = antiFraudRule.applyRule(command);
        statusPublisher.publishStatusUpdate(command.transactionExternalId(), newStatus);
    }
}