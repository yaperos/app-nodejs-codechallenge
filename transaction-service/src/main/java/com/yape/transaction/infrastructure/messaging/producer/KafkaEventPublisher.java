package com.yape.transaction.infrastructure.messaging.producer;

import com.yape.transaction.domain.port.EventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Adaptador de Kafka Producer - Implementa el port EventPublisher
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaEventPublisher implements EventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public <T> void publish(String topic, String key, T event) {
        log.info("Publishing event to topic: {} with key: {}", topic, key);

        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, key, event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Event published successfully to topic: {} with offset: {}",
                        topic, result.getRecordMetadata().offset());
            } else {
                log.error("Failed to publish event to topic: {}", topic, ex);
            }
        });
    }
}

