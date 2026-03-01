package com.retotecnico.transaction.infrastructure.adapter.out.messaging;

import com.retotecnico.common.event.TransactionStatusEvent;
import com.retotecnico.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer - listens for transaction status updates from Anti-Fraud service.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaTransactionStatusConsumer {

    private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

    @KafkaListener(
            topics = "transaction-status",
            groupId = "transaction-service-group",
            containerFactory = "statusKafkaListenerContainerFactory"
    )
    public void onTransactionStatus(TransactionStatusEvent event) {
        log.info("Received transaction-status event: id={}, status={}",
                event.getTransactionExternalId(), event.getStatus());

        updateTransactionStatusUseCase.execute(
                event.getTransactionExternalId(),
                event.getStatus()
        );
    }
}
