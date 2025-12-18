package com.yape.antifraud.service.impl;

import com.yape.antifraud.dto.TransactionValidatedEvent;
import com.yape.antifraud.service.TransactionValidatedEventPublisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class TransactionValidatedEventPublisherImpl implements TransactionValidatedEventPublisher {

    private final KafkaTemplate<String, TransactionValidatedEvent> kafkaTemplate;
    private final String transactionValidatedTopic;

    public TransactionValidatedEventPublisherImpl(
            KafkaTemplate<String, TransactionValidatedEvent> kafkaTemplate,
            @Value("${app.topics.transaction-validated}") String transactionValidatedTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.transactionValidatedTopic = transactionValidatedTopic;
    }

    @Override
    public void createTransactionValidatedEvent(TransactionValidatedEvent transactionValidatedEvent)
            throws Exception {
        String key = transactionValidatedEvent.transactionExternalId().toString();
        kafkaTemplate.send(transactionValidatedTopic, key, transactionValidatedEvent).get();
    }
}
