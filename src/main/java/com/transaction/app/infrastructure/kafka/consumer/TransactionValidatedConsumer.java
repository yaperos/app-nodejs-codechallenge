package com.transaction.app.infrastructure.kafka.consumer;

import com.transaction.app.domain.port.out.TransactionRepositoryPort;
import com.transaction.app.infrastructure.kafka.event.TransactionValidatedEvent;
import lombok.AllArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class TransactionValidatedConsumer {

    private final TransactionRepositoryPort repository;

    @KafkaListener(topics = "transaction-validated", groupId = "transaction")
    public void update(TransactionValidatedEvent event) {
        repository.updateStatus(
                event.getTransactionExternalId(),
                event.getStatus()
        );
    }
}
