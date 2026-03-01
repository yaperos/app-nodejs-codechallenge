package com.retotecnico.antifraud.infrastructure.adapter.messaging;

import com.retotecnico.common.event.TransactionCreatedEvent;
import com.retotecnico.antifraud.domain.port.in.ValidateTransactionUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer - listens for transaction-created events.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaFraudConsumer {

    private final ValidateTransactionUseCase validateTransactionUseCase;

    @KafkaListener(
            topics = "transaction-created",
            groupId = "anti-fraud-service-group",
            containerFactory = "createdKafkaListenerContainerFactory"
    )
    public void onTransactionCreated(TransactionCreatedEvent event) {
        log.info("Received transaction-created event: id={}, value={}",
                event.getTransactionExternalId(), event.getValue());

        validateTransactionUseCase.execute(
                event.getTransactionExternalId(),
                event.getValue()
        );
    }
}
