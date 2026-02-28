package com.yape.challenge.antifraud.infrastructure.adapters.out.kafka;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import com.yape.challenge.antifraud.domain.messaging.EventPublisher;
import com.yape.challenge.antifraud.domain.model.TransactionStatus;
import com.yape.challenge.antifraud.infrastructure.adapters.out.kafka.dto.TransactionStatusUpdateEvent;
import com.yape.challenge.antifraud.infrastructure.config.KafkaTopicConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaEventPublisherAdapter implements EventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> publishTransactionStatusUpdate(UUID transactionId, TransactionStatus status) {
        return Mono.fromRunnable(() -> {
            try {
                TransactionStatusUpdateEvent event = TransactionStatusUpdateEvent.builder()
                        .transactionId(transactionId)
                        .status(status)
                        .build();

                String payload = objectMapper.writeValueAsString(event);
                kafkaTemplate.send(KafkaTopicConfig.TRANSACTION_STATUS_TOPIC, transactionId.toString(), payload);
                log.info("Published TransactionStatusUpdateEvent for ID: {} with status: {}", transactionId, status);

            } catch (JacksonException e) {
                log.error("Error serializing TransactionStatusUpdateEvent", e);
            }
        });
    }
}
