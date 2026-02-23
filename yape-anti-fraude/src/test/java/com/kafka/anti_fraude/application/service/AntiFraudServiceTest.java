package com.kafka.anti_fraude.application.service;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.kafka.anti_fraude.application.usecase.AntiFraudRuleUseCase;
import com.kafka.anti_fraude.application.usecase.TransactionPublisherUseCase;
import com.kafka.anti_fraude.domain.command.TransactionValidationCommand;

public class AntiFraudServiceTest {
    @Mock
    private AntiFraudRuleUseCase antiFraudRule;

    @Mock
    private TransactionPublisherUseCase statusPublisher;

    private AntiFraudService antiFraudService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        antiFraudService = new AntiFraudService(antiFraudRule, statusPublisher);
    }

    @Test
    void execute_shouldPublishApprovedStatus_whenRuleReturnsApproved() {
        UUID transactionId = UUID.randomUUID();
        TransactionValidationCommand command = new TransactionValidationCommand(transactionId, 500.0);

        when(antiFraudRule.applyRule(command)).thenReturn("APPROVED");

        antiFraudService.execute(command);

        verify(statusPublisher).publishStatusUpdate(transactionId, "APPROVED");
    }

    @Test
    void execute_shouldPublishRejectedStatus_whenRuleReturnsRejected() {
        UUID transactionId = UUID.randomUUID();
        TransactionValidationCommand command = new TransactionValidationCommand(transactionId, 1500.0);

        when(antiFraudRule.applyRule(command)).thenReturn("REJECTED");

        antiFraudService.execute(command);

        verify(statusPublisher).publishStatusUpdate(transactionId, "REJECTED");
    }
}
