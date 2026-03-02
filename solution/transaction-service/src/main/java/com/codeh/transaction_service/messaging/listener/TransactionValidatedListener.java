package com.codeh.transaction_service.messaging.listener;

import com.codeh.transaction_service.messaging.event.TransactionValidatedEvent;
import com.codeh.transaction_service.model.Transaction;
import com.codeh.transaction_service.model.TransactionStatus;
import com.codeh.transaction_service.repository.TransactionRepository;
import com.codeh.transaction_service.repository.TransactionStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class TransactionValidatedListener {

    private final TransactionRepository transactionRepository;
    private final TransactionStatusRepository statusRepository;

    @Transactional
    @KafkaListener(topics = "${kafka.topics.transaction-validated}", groupId = "${spring.kafka.consumer.group-id}")
    public void onValidated(TransactionValidatedEvent event) {

        Transaction tx = transactionRepository.findByTransactionExternalId(event.transactionExternalId())
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + event.transactionExternalId()));

        if (tx.getStatus().getName().equals(event.status())) {
            return;
        }

        TransactionStatus newStatus = statusRepository.findByName(event.status())
                .orElseThrow(() -> new RuntimeException("Status not found: " + event.status()));


        tx.setStatus(newStatus);
        transactionRepository.save(tx);
    }
}