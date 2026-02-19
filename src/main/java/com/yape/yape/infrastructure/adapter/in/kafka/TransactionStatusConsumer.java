package com.yape.yape.infrastructure.adapter.in.kafka;

import com.yape.yape.application.dto.TransactionStatusUpdatedEvent;
import com.yape.yape.application.usecase.UpdateTransactionStatusUseCase;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionStatusConsumer {

    private final UpdateTransactionStatusUseCase updateTransactionStatusUseCase;

    public TransactionStatusConsumer(UpdateTransactionStatusUseCase updateTransactionStatusUseCase) {
        this.updateTransactionStatusUseCase = updateTransactionStatusUseCase;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.transaction-approved}",
            groupId = "transaction-status-group",
            containerFactory = "transactionStatusKafkaListenerContainerFactory"
    )
    public void onApproved(TransactionStatusUpdatedEvent event) {
        updateTransactionStatusUseCase.execute(event.getTransactionExternalId(), event.getStatus());
    }

    @KafkaListener(
            topics = "${app.kafka.topics.transaction-rejected}",
            groupId = "transaction-status-group",
            containerFactory = "transactionStatusKafkaListenerContainerFactory"
    )
    public void onRejected(TransactionStatusUpdatedEvent event) {
        updateTransactionStatusUseCase.execute(event.getTransactionExternalId(), event.getStatus());
    }
}
