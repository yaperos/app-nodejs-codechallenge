package com.yape.yape.infrastructure.adapter.in.kafka;

import com.yape.yape.application.dto.TransactionCreatedEvent;
import com.yape.yape.application.dto.TransactionStatusUpdatedEvent;
import com.yape.yape.domain.model.TransactionStatus;
import com.yape.yape.domain.port.EventPublisherPort;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;

@Component
public class AntiFraudConsumer {

    private static final BigDecimal LIMIT = BigDecimal.valueOf(1000);

    private final EventPublisherPort eventPublisherPort;

    public AntiFraudConsumer(EventPublisherPort eventPublisherPort) {
        this.eventPublisherPort = eventPublisherPort;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.transaction-created}",
            groupId = "antifraud-group-v2",
            containerFactory = "transactionCreatedKafkaListenerContainerFactory"
    )
    public void onTransactionCreated(TransactionCreatedEvent event) {

        TransactionStatus status = event.getValue().compareTo(LIMIT) > 0
                ? TransactionStatus.REJECTED
                : TransactionStatus.APPROVED;

        TransactionStatusUpdatedEvent resultEvent = TransactionStatusUpdatedEvent.builder()
                .transactionExternalId(event.getTransactionExternalId())
                .status(status)
                .updatedAt(Instant.now())
                .build();

        if (status == TransactionStatus.APPROVED) {
            eventPublisherPort.publishTransactionApproved(resultEvent);
        } else {
            eventPublisherPort.publishTransactionRejected(resultEvent);
        }
    }
}
