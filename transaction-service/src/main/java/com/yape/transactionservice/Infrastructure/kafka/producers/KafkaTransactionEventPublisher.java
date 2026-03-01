package com.yape.transactionservice.Infrastructure.kafka.producers;

import com.yape.transactionservice.application.abstractions.TransactionEventPublisher;
import com.yape.transactionservice.domain.models.Transaction;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaTransactionEventPublisher implements TransactionEventPublisher {

    private final KafkaTemplate<String, Transaction> kafkaTemplate;

    public KafkaTransactionEventPublisher(KafkaTemplate<String, Transaction> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        kafkaTemplate.send("transaction.created", transaction.getTransactionExternalId().toString(), transaction);
    }
}
