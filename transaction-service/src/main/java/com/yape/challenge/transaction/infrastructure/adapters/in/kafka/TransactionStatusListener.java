package com.yape.challenge.transaction.infrastructure.adapters.in.kafka;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import com.yape.challenge.transaction.application.usecase.UpdateTransactionStatusUseCase;
import com.yape.challenge.transaction.infrastructure.adapters.in.kafka.dto.TransactionStatusUpdateEvent;
import com.yape.challenge.transaction.infrastructure.config.KafkaTopicConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionStatusListener {

    private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopicConfig.TRANSACTION_STATUS_TOPIC, groupId = "transaction-group")
    public void consumeTransactionStatusEvent(String message) {
        log.info("Received transaction status event: {}", message);
        try {
            TransactionStatusUpdateEvent event = objectMapper.readValue(message, TransactionStatusUpdateEvent.class);
            updateTransactionStatusUseCase.execute(event.getTransactionId(), event.getStatus())
                    .doOnSuccess(t -> log.info("Successfully updated status to {} for transaction {}",
                            event.getStatus(), event.getTransactionId()))
                    .doOnError(e -> log.error("Failed to update transaction status", e))
                    .subscribe();

        } catch (JacksonException e) {
            log.error("Failed to deserialize transaction status event", e);
        }
    }
}
