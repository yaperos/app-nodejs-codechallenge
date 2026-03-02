package com.yape.infra.adapter.out.kafka;

import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;
import org.springframework.stereotype.Component;

import com.yape.application.port.out.TransactionEventPublishPort;
import com.yape.domain.model.Transaction;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.SenderResult;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionKafkaProducer implements TransactionEventPublishPort {

    private final ReactiveKafkaProducerTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC_CREATED = "transaction-created";

    @Override
    public Mono<SenderResult<Void>> publishTransactionCreated(Transaction transaction) {
        log.info("Publishing transaction created event: {}", transaction.getTransactionExternalId());
        return kafkaTemplate.send(TOPIC_CREATED, transaction.getTransactionExternalId().toString(), transaction);
    }
}
