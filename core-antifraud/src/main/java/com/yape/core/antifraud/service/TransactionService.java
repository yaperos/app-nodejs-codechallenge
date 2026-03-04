package com.yape.core.antifraud.service;

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
public class TransactionService {
    private final KafkaTemplate<String, TransactionData> kafkaTemplate;
    private final ValidationService validationService;

    @Value("${app.kafka.topic-result}")
    private String resultTopic;
    @Value("${app.kafka.topic-request}")
    private String requestTopic;

    public Mono<SendResult<String, TransactionData>> sendTransactionRequest(TransactionData transaction) {
        log.info("SEND [{}] with body: {}", resultTopic, transaction);
        return Mono.fromFuture(
                    kafkaTemplate.send(resultTopic, transaction.getId().toString(), transaction))
                .doOnSuccess(
                    result -> log.info("SUCCESS send to topic: {}", result.getRecordMetadata().topic()))
                .doOnError(
                    ex -> log.error("FAILED to Send transaction", ex));
    }

    @KafkaListener(topics = "${app.kafka.topic-request}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenTransactionResult(@Payload TransactionData transaction,
                                        @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        log.info("RECEIVED [{}] with key: {}, {}", requestTopic, key, transaction);

        TransactionData validated = validationService.process(transaction);
        log.info("VALIDATED transaction STATUS={}", validated.getStatus());
        sendTransactionRequest(validated)
            .subscribe();
    }
}
