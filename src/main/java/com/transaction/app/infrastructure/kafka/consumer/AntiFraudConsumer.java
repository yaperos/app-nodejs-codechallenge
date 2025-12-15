package com.transaction.app.infrastructure.kafka.consumer;

import com.transaction.app.domain.model.TransactionStatus;
import com.transaction.app.infrastructure.kafka.event.TransactionCreatedEvent;
import com.transaction.app.infrastructure.kafka.event.TransactionValidatedEvent;
import lombok.AllArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@AllArgsConstructor
public class AntiFraudConsumer {

    private final KafkaTemplate<String, TransactionValidatedEvent> kafkaTemplate;

    @KafkaListener(topics = "transaction-created", groupId = "anti-fraud")
    public void validate(TransactionCreatedEvent event) {

        TransactionStatus status =
                event.getValue().compareTo(BigDecimal.valueOf(1000)) > 0
                        ? TransactionStatus.REJECTED
                        : TransactionStatus.APPROVED;

        kafkaTemplate.send(
                "transaction-validated",
                event.getTransactionExternalId().toString(),
                new TransactionValidatedEvent(
                        event.getTransactionExternalId(),
                        status
                )
        );
    }
}
