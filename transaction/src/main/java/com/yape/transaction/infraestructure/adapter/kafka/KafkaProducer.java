package com.yape.transaction.infraestructure.adapter.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.domain.model.EventOutbound;
import com.yape.transaction.domain.ports.KafkaProducerPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class KafkaProducer implements KafkaProducerPort {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducer.class);

    private final ReactiveKafkaProducerTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${spring.kafka.topics.anti-fraud}")
    private String antiFraudTopic;

    @Override
    public Mono<Void> sendValidate(EventOutbound eventOutbound) {
        return Mono.fromCallable(() -> objectMapper.writeValueAsString(eventOutbound))
                .doOnNext(message -> logger.info("Sending event to Kafka: {}", message))
                .flatMap(message -> kafkaTemplate.send(antiFraudTopic,
                        eventOutbound.getTransactionExternalId(), message))
                .doOnSuccess(result -> logger.info("Event sent successfully to topic: {}", antiFraudTopic))
                .doOnError(e -> logger.error("Error sending event to Kafka: {}", e.getMessage()))
                .onErrorMap(JsonProcessingException.class,
                        e -> new RuntimeException("Error serializing EventOutbound", e))
                .then();
    }
}
