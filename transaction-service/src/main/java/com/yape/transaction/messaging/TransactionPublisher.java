package com.yape.transaction.messaging;

import com.yape.transaction.event.TransactionEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionPublisher {

    private final ReactiveKafkaProducerTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.transactions}")
    private String transactionsTopic;

    public Mono<Void> publish(TransactionEvent event) {
        return kafkaTemplate
                .send(transactionsTopic, event.getTransactionId(), event)
                .doOnSuccess(result -> log.info(
                        "Transaction published: {} | partition: {} | offset: {}",
                        event.getTransactionId(),
                        result.recordMetadata().partition(),
                        result.recordMetadata().offset()
                ))
                .doOnError(ex -> log.error(
                        "Failed to publish transaction: {}", event.getTransactionId(), ex
                ))
                .retryWhen(Retry.backoff(3, Duration.ofMillis(500)))
                .then();
    }
}