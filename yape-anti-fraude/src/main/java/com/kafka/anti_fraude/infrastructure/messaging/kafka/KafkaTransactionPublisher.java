package com.kafka.anti_fraude.infrastructure.messaging.kafka;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.kafka.anti_fraude.application.usecase.TransactionPublisherUseCase;
import com.kafka.anti_fraude.infrastructure.messaging.dto.TransactionUpdatedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaTransactionPublisher implements TransactionPublisherUseCase {

    private final KafkaTemplate<String, TransactionUpdatedEvent> kafkaTemplate;

    @Value("${app.kafka.topic-status-updated}")
    private String topicUpdate;

    @Override
    public void publishStatusUpdate(UUID transactionExternalId, String newStatus) {
        TransactionUpdatedEvent event = new TransactionUpdatedEvent(transactionExternalId, newStatus);
        log.info("Publishing transaction status update event: {}", event);
        kafkaTemplate.send(topicUpdate, transactionExternalId.toString(), event);

    }
}
