package com.yaperos.codechallenge.transaction.infrastructure.adapter.input.kafka;

import com.yaperos.codechallenge.shared.config.KafkaTopicConfig;
import com.yaperos.codechallenge.shared.event.TransactionStatusEvent;
import com.yaperos.codechallenge.transaction.domain.port.input.UpdateTransactionStatusUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionStatusKafkaConsumer {

    private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

    @KafkaListener(topics = KafkaTopicConfig.TRANSACTION_STATUS_TOPIC,
            groupId = "transaction-status-group",
            concurrency = "3",
            properties = "spring.json.value.default.type=com.yaperos.codechallenge.shared.event.TransactionStatusEvent")
    public void consume(TransactionStatusEvent event) {
        log.info("Received transaction-status event: transactionId={}, status={}",
                event.getTransactionExternalId(), event.getStatus());
        try {
            updateTransactionStatusUseCase.updateStatus(event.getTransactionExternalId(), event.getStatus());
        } catch (Exception ex) {
            log.error("Failed to process transaction-status event: transactionId={}, status={}",
                    event.getTransactionExternalId(), event.getStatus(), ex);
            throw ex;
        }
    }

}
