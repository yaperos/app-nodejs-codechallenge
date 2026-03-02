package com.yape.infra.adapter.in.kafka;

import java.math.BigDecimal;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.yape.application.port.out.TransactionRepositoryPort;
import com.yape.domain.model.Transaction;
import com.yape.domain.model.TransactionStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionKafkaConsumer {

    private final TransactionRepositoryPort transactionRepository;

    @KafkaListener(topics = "transaction-created", groupId = "transaction-group")
    public void consumeTransactionCreated(Transaction transaction) {
        transactionRepository.findById(transaction.getTransactionExternalId())
            .flatMap(existingTransaction -> {
                // Simple business logic: if the transaction value is greater than 1000, reject it; otherwise, approve it
                if (transaction.getValue().compareTo(new BigDecimal("1000")) > 0) {
                    existingTransaction.setStatus(TransactionStatus.REJECTED);
                } else {
                    existingTransaction.setStatus(TransactionStatus.APPROVED);
                }
                
                return transactionRepository.save(existingTransaction);
            })
            .doOnSuccess(updatedTransaction -> log.info("Transaction status updated to: {}", updatedTransaction.getStatus()))
            .doOnError(error -> log.error("Error updating transaction status", error))
            .subscribe();
    }
}
