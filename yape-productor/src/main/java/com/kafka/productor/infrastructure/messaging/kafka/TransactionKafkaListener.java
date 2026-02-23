package com.kafka.productor.infrastructure.messaging.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.kafka.productor.application.usecase.service.update.UpdateTransactionStatusUseCase;
import com.kafka.productor.domain.port.EventListenerPort;
import com.kafka.productor.infrastructure.messaging.event.TransactionStatusUpdatedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionKafkaListener implements EventListenerPort {

    private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

    @Override
    @KafkaListener(topics = "${app.kafka.topic-status-updated}", groupId = "antifraud-group")
    public void publishTransactionStatusUpdated(TransactionStatusUpdatedEvent event) {
        log.info("publishTransactionStatusUpdated: {}: {}",
            event.transactionExternalId(), event.status());
        updateTransactionStatusUseCase.execute(event.transactionExternalId(), event.status());
    }
}
