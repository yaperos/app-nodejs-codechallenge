package com.jotace.antifraud.infrastructure.adapter.out;

import com.jotace.antifraud.application.port.out.TransactionStatusPublisherPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class KafkaStatusUpdateAdapter implements TransactionStatusPublisherPort {

    private static final Logger log = LoggerFactory.getLogger(KafkaStatusUpdateAdapter.class);
    private static final String TOPIC = "transaction-status-updated";
    private final KafkaTemplate<String, TransactionStatusUpdatedEvent> kafkaTemplate;

    public KafkaStatusUpdateAdapter(KafkaTemplate<String, TransactionStatusUpdatedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishStatusUpdate(UUID transactionExternalId, String newStatus) {

        TransactionStatusUpdatedEvent event =
                new TransactionStatusUpdatedEvent(transactionExternalId, newStatus);

        try {
            kafkaTemplate.send(TOPIC, transactionExternalId.toString(), event);

            log.info("Status update published | ID: {} | Status: {}",
                    transactionExternalId, newStatus);

        } catch (Exception e) {
            log.error("Failed to send status update event for ID: {}", transactionExternalId, e);
            throw new IllegalStateException("Kafka publishing failed.", e);
        }
    }

}
