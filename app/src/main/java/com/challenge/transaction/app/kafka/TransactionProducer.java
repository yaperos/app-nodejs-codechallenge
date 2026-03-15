package com.challenge.transaction.app.kafka;

import com.challenge.transaction.core.domain.model.Transaction;
import com.challenge.transaction.core.ports.output.TransactionEventPublisher;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class TransactionProducer implements TransactionEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        log.info("[TRANSACTION-SEND] init...");
        log.info("[TRANSACTION-SEND] transactionId: {}", transaction.getTransactionExternalId());

        kafkaTemplate.send("transaction-created", transaction);

        log.info("[TRANSACTION-SEND] init...");
    }
}
