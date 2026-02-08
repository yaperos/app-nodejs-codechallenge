package com.yaperos.codechallenge.transaction.infrastructure.adapter.output.kafka;

import com.yaperos.codechallenge.shared.config.KafkaTopicConfig;
import com.yaperos.codechallenge.shared.event.TransactionCreatedEvent;
import com.yaperos.codechallenge.transaction.domain.model.Transaction;
import com.yaperos.codechallenge.transaction.domain.port.output.TransactionEventPublisherPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionKafkaPublisher implements TransactionEventPublisherPort {

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        var event = new TransactionCreatedEvent(
                transaction.getTransactionExternalId(),
                transaction.getValue()
        );
        log.info("Publishing transaction-created event for transaction: {}", transaction.getTransactionExternalId());
        kafkaTemplate.send(KafkaTopicConfig.TRANSACTION_CREATED_TOPIC,
                transaction.getTransactionExternalId().toString(),
                event);
    }

}
