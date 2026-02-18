package com.jotace.transaction.infrastructure.adapter.in.consumer;

import com.jotace.transaction.application.port.in.UpdateTransactionStatusUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionStatusKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(TransactionStatusKafkaConsumer.class);

    private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

    public TransactionStatusKafkaConsumer(UpdateTransactionStatusUseCase updateTransactionStatusUseCase) {
        this.updateTransactionStatusUseCase = updateTransactionStatusUseCase;
    }

    @KafkaListener(topics = "transaction-status-updated", groupId = "transaction-status-group")
    public void listen(TransactionStatusUpdatedEvent event) {

        try {

            log.info("Received status update | ID: {} | newStatus: {}",
                    event.transactionExternalId(), event.newStatus());

            try {

                updateTransactionStatusUseCase.updateStatus(
                        event.transactionExternalId(),
                        event.newStatus()
                );

            } catch (Exception e) {
                log.error("Error processing transaction-status-updated event", e);
            }

        } catch (Exception e) {
            log.error("Error processing transaction-status-updated event", e);
        }
    }

}
