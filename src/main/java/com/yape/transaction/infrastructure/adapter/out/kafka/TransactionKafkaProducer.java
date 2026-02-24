package com.yape.transaction.infrastructure.adapter.out.kafka;

import com.yape.transaction.application.port.out.TransactionEventPublisherPort;
import com.yape.transaction.domain.model.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionKafkaProducer implements TransactionEventPublisherPort {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC_CREATED = "transaction-created";

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        log.info("Publishing transaction created event: {}", transaction.getTransactionExternalId());
        kafkaTemplate.send(TOPIC_CREATED, transaction.getTransactionExternalId().toString(), transaction);
    }
}
