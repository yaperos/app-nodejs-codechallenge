package com.yape.antifraud.messaging;

import com.yape.antifraud.event.FraudResultEvent;
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
public class FraudResultPublisher {

    private final ReactiveKafkaProducerTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.fraud-results}")
    private String fraudResultsTopic;

    public Mono<Void> publish(FraudResultEvent event) {
        return kafkaTemplate
                .send(fraudResultsTopic, event.getTransactionId(), event)
                .doOnSuccess(result -> log.info(
                        "Fraud result published: {} | status: {}",
                        event.getTransactionId(),
                        event.getTransactionStatus()
                ))
                .doOnError(ex -> log.error(
                        "Failed to publish fraud result: {}", event.getTransactionId(), ex
                ))
                .retryWhen(Retry.backoff(3, Duration.ofMillis(500)))
                .then();
    }
}
