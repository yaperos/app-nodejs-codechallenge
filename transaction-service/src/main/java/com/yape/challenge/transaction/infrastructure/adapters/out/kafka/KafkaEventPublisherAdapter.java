package com.yape.challenge.transaction.infrastructure.adapters.out.kafka;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import com.yape.challenge.transaction.domain.messaging.EventPublisher;
import com.yape.challenge.transaction.domain.model.Transaction;
import com.yape.challenge.transaction.infrastructure.adapters.out.kafka.dto.TransactionCreatedEvent;
import com.yape.challenge.transaction.infrastructure.config.KafkaTopicConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaEventPublisherAdapter implements EventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> publishTransactionCreatedEvent(Transaction transaction) {
        return Mono.fromRunnable(() -> {
            try {
                TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                        .transactionId(transaction.getId())
                        .value(transaction.getValue())
                        .build();

                String payload = objectMapper.writeValueAsString(event);
                kafkaTemplate.send(KafkaTopicConfig.TRANSACTION_CREATED_TOPIC, transaction.getId().toString(), payload);
                log.info("Published TransactionCreatedEvent for ID: {}", transaction.getId());

            } catch (JacksonException e) {
                log.error("Error serializing TransactionCreatedEvent", e);
            }
        });
    }
}
