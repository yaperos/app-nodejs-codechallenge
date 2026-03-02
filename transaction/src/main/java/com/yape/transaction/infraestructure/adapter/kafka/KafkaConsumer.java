package com.yape.transaction.infraestructure.adapter.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.application.usecase.UpdateTransactionUseCase;
import com.yape.transaction.domain.model.EventInbound;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.util.retry.Retry;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class KafkaConsumer {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumer.class);

    private final UpdateTransactionUseCase updateTransactionPort;
    private final ObjectMapper objectMapper;
    private final ReceiverOptions<String, String> receiverOptions;

    @PostConstruct
    public void listen() {
        KafkaReceiver.create(receiverOptions)
                .receive()
                .flatMap(record -> {
                    logger.info("Received message - topic: {}, offset: {}, message: {}",
                            record.topic(), record.offset(), record.value());
                    return parseEvent(record.value())
                            .flatMap(updateTransactionPort::execute)
                            .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                                    .maxBackoff(Duration.ofSeconds(5))
                                    .doBeforeRetry(signal -> logger.warn("Retrying message - offset: {}, attempt: {}",
                                            record.offset(), signal.totalRetries() + 1)))
                            .doOnSuccess(v -> {
                                record.receiverOffset().acknowledge();
                                logger.info("Message acknowledged - offset: {}", record.offset());
                            })
                            .doOnError(e -> logger.error("Error processing message - offset: {}, error: {}",
                                    record.offset(), e.getMessage()))
                            .onErrorResume(e -> {
                                record.receiverOffset().acknowledge();
                                return Mono.empty();
                            });
                })
                .subscribe(
                        null,
                        e -> logger.error("Fatal error in Kafka consumer: {}", e.getMessage())
                );
    }

    private Mono<EventInbound> parseEvent(String message) {
        return Mono.fromCallable(() ->
                objectMapper.readValue(message, EventInbound.class))
                .doOnError(e -> logger.error("Error parsing message: {}", e.getMessage()));
    }
}
