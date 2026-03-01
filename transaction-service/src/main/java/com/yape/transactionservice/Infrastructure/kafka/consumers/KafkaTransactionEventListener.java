package com.yape.transactionservice.Infrastructure.kafka.consumers;

import com.yape.transactionservice.application.abstractions.TransactionEventListener;
import com.yape.transactionservice.domain.models.Transaction;
import com.yape.transactionservice.domain.repostories.TransactionRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaTransactionEventListener implements TransactionEventListener {
    private final TransactionRepository transactionRepository;

    public KafkaTransactionEventListener(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    @KafkaListener(topics = "transaction.status")
    public void onTransactionStatusUpdated(Transaction transaction) {
        transactionRepository
                .getById(transaction.getTransactionExternalId())
                .ifPresent(existing -> {
                    existing.changeStatus(transaction.getStatus());
                    transactionRepository.save(existing);
                });
    }
}
