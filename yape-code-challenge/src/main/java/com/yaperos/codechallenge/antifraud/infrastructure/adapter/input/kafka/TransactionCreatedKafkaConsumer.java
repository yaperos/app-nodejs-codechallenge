package com.yaperos.codechallenge.antifraud.infrastructure.adapter.input.kafka;

import com.yaperos.codechallenge.antifraud.domain.port.input.ValidateTransactionUseCase;
import com.yaperos.codechallenge.shared.config.KafkaTopicConfig;
import com.yaperos.codechallenge.shared.event.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionCreatedKafkaConsumer {

    private final ValidateTransactionUseCase validateTransactionUseCase;

    @KafkaListener(topics = KafkaTopicConfig.TRANSACTION_CREATED_TOPIC,
            groupId = "anti-fraud-group",
            concurrency = "3",
            properties = "spring.json.value.default.type=com.yaperos.codechallenge.shared.event.TransactionCreatedEvent")
    public void consume(TransactionCreatedEvent event) {
        log.info("Received transaction-created event: transactionId={}, value={}",
                event.getTransactionExternalId(), event.getValue());
        validateTransactionUseCase.validate(event.getTransactionExternalId(), event.getValue());
    }

}
