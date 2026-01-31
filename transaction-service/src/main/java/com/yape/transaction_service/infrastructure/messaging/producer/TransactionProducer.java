package com.yape.transaction_service.infrastructure.messaging.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.yape.transaction_service.domain.event.TransactionCreatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionProducer {

    private static final String TOPIC = "transaction.created";

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    public void send(TransactionCreatedEvent event) {
        log.info("Sending TransactionCreatedEvent: {}", event.getTransactionExternalId());
        kafkaTemplate.send(TOPIC, event.getTransactionExternalId().toString(), event);
    }

}
