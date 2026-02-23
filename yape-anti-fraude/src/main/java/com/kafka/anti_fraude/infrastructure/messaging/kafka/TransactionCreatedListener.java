package com.kafka.anti_fraude.infrastructure.messaging.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.kafka.anti_fraude.application.usecase.ValidateTransactionUseCase;
import com.kafka.anti_fraude.domain.command.TransactionValidationCommand;
import com.kafka.anti_fraude.infrastructure.messaging.event.TransactionCreatedEvent;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class TransactionCreatedListener {

    private final ValidateTransactionUseCase validateTransactionUseCase;

    public TransactionCreatedListener(ValidateTransactionUseCase validateTransactionUseCase) {
        this.validateTransactionUseCase = validateTransactionUseCase;
    }

    @KafkaListener(topics = "${app.kafka.topic-created}", groupId = "antifraud-group")
    public void listen(TransactionCreatedEvent event) {
        log.info("Received transaction created event: {}", event);
        TransactionValidationCommand command = new TransactionValidationCommand(
                event.transactionExternalId(),
                event.value()
        );

        validateTransactionUseCase.execute(command);
    }
}