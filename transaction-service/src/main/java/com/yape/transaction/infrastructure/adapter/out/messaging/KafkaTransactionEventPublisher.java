package com.yape.transaction.infrastructure.adapter.out.messaging;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaTransactionEventPublisher implements TransactionEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(KafkaTransactionEventPublisher.class);

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    @Value("${kafka.topics.transaction-created}")
    private String transactionCreatedTopic;

    public KafkaTransactionEventPublisher(KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        TransactionCreatedEvent event = new TransactionCreatedEvent(
                transaction.getTransactionExternalId(),
                transaction.getAccountExternalIdDebit(),
                transaction.getAccountExternalIdCredit(),
                transaction.getTransactionType().getName(),
                transaction.getValue()
        );

        kafkaTemplate.send(transactionCreatedTopic, transaction.getTransactionExternalId().toString(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish TransactionCreatedEvent for id: {}",
                                transaction.getTransactionExternalId(), ex);
                    } else {
                        log.info("TransactionCreatedEvent published for id: {}",
                                transaction.getTransactionExternalId());
                    }
                });
    }
}
