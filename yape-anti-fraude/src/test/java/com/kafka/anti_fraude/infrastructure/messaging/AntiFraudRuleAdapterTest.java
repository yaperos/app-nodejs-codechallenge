package com.kafka.anti_fraude.infrastructure.messaging;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.kafka.anti_fraude.domain.command.TransactionValidationCommand;

class AntiFraudRuleAdapterTest {

    private final AntiFraudRuleAdapter adapter = new AntiFraudRuleAdapter();

    @Test
    void applyRule_shouldReturnApproved_whenValueBelowThreshold() {
        TransactionValidationCommand command = new TransactionValidationCommand(UUID.randomUUID(), 500.0);
        assertEquals("APPROVED", adapter.applyRule(command));
    }

    @Test
    void applyRule_shouldReturnRejected_whenValueAboveThreshold() {
        TransactionValidationCommand command = new TransactionValidationCommand(UUID.randomUUID(), 1500.0);
        assertEquals("REJECTED", adapter.applyRule(command));
    }
}