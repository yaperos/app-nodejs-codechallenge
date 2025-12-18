package com.yape.transactions.service.impl;

import com.yape.transactions.dto.TransactionCreatedEvent;
import com.yape.transactions.service.TransactionEventPublisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutionException;

@Component
public class TransactionEventPublisherImpl implements TransactionEventPublisher {

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;
    private final String transactionTopic;

    public TransactionEventPublisherImpl(
            KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate,
            @Value("${app.topics.transaction-created}") String transactionTopic) {
        this.kafkaTemplate = kafkaTemplate;
        this.transactionTopic = transactionTopic;
    }

    @Override
    public void createTransactionEvent(TransactionCreatedEvent transactionCreatedEvent)
            throws ExecutionException, InterruptedException {
        String key = transactionCreatedEvent.transactionExternalId().toString();
        kafkaTemplate.send(transactionTopic, key, transactionCreatedEvent).get();
    }
}
