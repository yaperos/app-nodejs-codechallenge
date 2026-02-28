package com.yape.challenge.antifraud.infrastructure.adapters.in.kafka;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import com.yape.challenge.antifraud.application.usecase.ValidateTransactionUseCase;
import com.yape.challenge.antifraud.domain.model.Transaction;
import com.yape.challenge.antifraud.infrastructure.adapters.in.kafka.dto.TransactionCreatedEvent;
import com.yape.challenge.antifraud.infrastructure.config.KafkaTopicConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionCreatedListener {

    private final ValidateTransactionUseCase validateTransactionUseCase;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopicConfig.TRANSACTION_CREATED_TOPIC, groupId = "anti-fraud-group")
    public void consumeTransactionCreatedEvent(String message) {
        log.info("Received transaction created event: {}", message);

        TransactionCreatedEvent event = objectMapper.readValue(message, TransactionCreatedEvent.class);

        Transaction transaction = Transaction.builder()
                .id(event.getTransactionId())
                .value(event.getValue())
                .build();

        validateTransactionUseCase.execute(transaction)
                .doOnError(e -> log.error("Failed to process transaction validation", e))
                .subscribe();

    }
}
