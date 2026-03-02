package com.codeh.transaction_service.messaging.publisher;

import com.codeh.transaction_service.messaging.event.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionEventPublisher {

    @Value("${kafka.topics.transaction-created}")
    private String createdTopic;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishTransactionCreated(TransactionCreatedEvent event) {
        kafkaTemplate.send(createdTopic, event.transactionExternalId().toString(), event);
    }
}