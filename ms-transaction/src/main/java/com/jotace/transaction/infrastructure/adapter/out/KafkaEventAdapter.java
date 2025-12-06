package com.jotace.transaction.infrastructure.adapter.out;

import com.jotace.transaction.application.port.out.EventProducerPort;
import com.jotace.transaction.domain.model.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventAdapter implements EventProducerPort {

    private static final Logger log = LoggerFactory.getLogger(KafkaEventAdapter.class);
    private static final String TOPIC = "transaction-created";

    private final KafkaTemplate<String, Transaction> kafkaTemplate;

    public KafkaEventAdapter(KafkaTemplate<String, Transaction> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void sendTransactionCreatedEvent(Transaction transaction) {
        try {
            kafkaTemplate.send(TOPIC, transaction.transactionExternalId().toString(), transaction);
            log.info("Event published to Kafka TOPIC: {} | Key: {} | Status: {}",
                    TOPIC,
                    transaction.transactionExternalId(),
                    transaction.transactionStatus());
        } catch (Exception e) {
            log.error("Failed to send transaction event to Kafka for ID: {}",
                    transaction.transactionExternalId(), e);
            throw new IllegalStateException("Kafka publishing failed for transaction.", e);
        }
    }

}