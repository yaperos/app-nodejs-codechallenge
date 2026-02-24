package com.yape.transaction_service.consumer;

import com.yape.shared.TransactionValidatedEvent;
import com.yape.transaction_service.entity.Transaction;
import com.yape.transaction_service.entity.TransactionStatus;
import com.yape.transaction_service.repository.TransactionRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;


@Component
public class TransactionConsumer {

    private final TransactionRepository repository;

    public TransactionConsumer(TransactionRepository repository) {
        this.repository = repository;
    }

    @KafkaListener(topics = "transaction-validated", groupId = "transaction-group")
    public void updateStatus(TransactionValidatedEvent event) {

        Transaction transaction = repository
                .findByTransactionExternalId(event.transactionExternalId())
                .orElseThrow();

        transaction.setStatus(TransactionStatus.valueOf(event.status()));
        repository.save(transaction);
    }
}
