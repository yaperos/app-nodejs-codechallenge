package com.yape.transaction.infrastructure.adapter.in.kafka;

import com.yape.transaction.application.port.out.TransactionRepositoryPort;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionKafkaConsumer {

    private final TransactionRepositoryPort transactionRepository;

    @KafkaListener(topics = "transaction-created", groupId = "transaction-group")
    public void consumeTransactionCreated(Transaction transaction) {
        log.info("Received transaction created event: {}", transaction.getTransactionExternalId());

        // Anti-fraud logic (simplified)
        if (transaction.getValue().compareTo(new BigDecimal("1000")) > 0) {
            transaction.setStatus(TransactionStatus.REJECTED);
        } else {
            transaction.setStatus(TransactionStatus.APPROVED);
        }

        // Update transaction status in database
        transactionRepository.save(transaction);
        log.info("Transaction status updated to: {}", transaction.getStatus());
    }
}
