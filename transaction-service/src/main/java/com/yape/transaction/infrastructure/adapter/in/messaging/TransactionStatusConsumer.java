package com.yape.transaction.infrastructure.adapter.in.messaging;

import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TransactionStatusConsumer {

    private static final Logger log = LoggerFactory.getLogger(TransactionStatusConsumer.class);

    private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

    public TransactionStatusConsumer(UpdateTransactionStatusUseCase updateTransactionStatusUseCase) {
        this.updateTransactionStatusUseCase = updateTransactionStatusUseCase;
    }

    @KafkaListener(
            topics = "${kafka.topics.transaction-status-updated}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "statusUpdatedKafkaListenerContainerFactory"
    )
    public void consumeTransactionStatusUpdated(TransactionStatusUpdatedEvent event) {
        log.info("Received status update for transaction: {} → {}", event.transactionExternalId(), event.status());

        updateTransactionStatusUseCase.execute(new UpdateTransactionStatusUseCase.Command(
                UUID.fromString(event.transactionExternalId()),
                TransactionStatus.valueOf(event.status())
        ));
    }
}
