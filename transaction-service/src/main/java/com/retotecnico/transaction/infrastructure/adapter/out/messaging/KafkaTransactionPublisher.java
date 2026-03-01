package com.retotecnico.transaction.infrastructure.adapter.out.messaging;

import com.retotecnico.common.event.TransactionCreatedEvent;
import com.retotecnico.transaction.domain.model.Transaction;
import com.retotecnico.transaction.domain.port.out.TransactionEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * Adapter implementing the output port - publishes events to Kafka.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaTransactionPublisher implements TransactionEventPublisher {

    private static final String TOPIC = "transaction-created";

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transaction.getTransactionExternalId())
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .transferTypeId(transaction.getTransferType().getId())
                .value(transaction.getValue())
                .build();

        kafkaTemplate.send(TOPIC, transaction.getTransactionExternalId().toString(), event);
        log.info("Published transaction-created event for: {}", transaction.getTransactionExternalId());
    }
}
