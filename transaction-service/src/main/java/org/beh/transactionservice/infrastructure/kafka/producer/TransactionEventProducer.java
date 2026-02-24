package org.beh.transactionservice.infrastructure.kafka.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    private static final String TRANSACTION_CREATED_TOPIC = "transaction.created";

    /**
     * Key = transactionId → guarantees all events for the same transaction
     * land on the same partition, preserving ordering per transaction.
     */
    public void publish(String eventType, String key, String payload) {
        String topic = resolveTopic(eventType);
        kafkaTemplate.send(topic, key, payload)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish event [{}] key [{}] to topic [{}]: {}",
                            eventType, key, topic, ex.getMessage());
                        throw new RuntimeException("Kafka publish failed for event: " + eventType, ex);
                    }
                    log.debug("Event [{}] published to partition [{}] offset [{}]",
                        eventType,
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
                });
    }

    private String resolveTopic(String eventType) {
        return switch (eventType) {
            case "TRANSACTION_CREATED" -> TRANSACTION_CREATED_TOPIC;
            default -> throw new IllegalArgumentException("No topic mapping for event type: " + eventType);
        };
    }
}
