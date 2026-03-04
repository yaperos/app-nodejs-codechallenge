package com.yape.business.financial.infrastructure.service;

import com.yape.business.financial.infrastructure.events.TransactionUpdatedEvent;
import com.yape.business.financial.infrastructure.events.command.CommandBus;
import com.yape.business.financial.infrastructure.events.command.UpdateTransactionStatusCommand;
import com.yape.shared.domain.TransactionData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionMessageService {
    private final KafkaTemplate<String, TransactionData> kafkaTemplate;
    private final CommandBus commandBus;

    @Value("${app.kafka.topic-result}")
    private String resultTopic;
    @Value("${app.kafka.topic-request}")
    private String requestTopic;

    public Mono<SendResult<String, TransactionData>> sendTransactionRequest(TransactionData transaction) {
        log.info("SEND [{}] with body: {}", requestTopic, transaction);

        return Mono.fromFuture(
                kafkaTemplate.send(requestTopic, transaction.getId().toString(), transaction))
            .doOnSuccess(
                result -> log.info("SUCCESS send to topic: {}", result.getRecordMetadata().topic()))
            .doOnError(
                ex -> log.error("FAILED to Send transaction [TOPIC={}]", requestTopic, ex));
    }

    @KafkaListener(topics = "${app.kafka.topic-result}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenTransactionResult(@Payload TransactionData transaction,
                                        @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        log.info("RECEIVED [{}] with key: {}, {}", resultTopic, key, transaction);

        // Actualizar el STATUS
        commandBus.dispatch(UpdateTransactionStatusCommand.builder()
                .id(transaction.getId())
                .status(transaction.getStatus())
                .build());
        log.info("VALIDATED transaction STATUS={}", transaction.getStatus());
    }
}