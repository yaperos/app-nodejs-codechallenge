package com.challenge.transaction.app.kafka;

import com.challenge.transaction.core.domain.enums.TransactionStatus;
import com.challenge.transaction.core.domain.event.FraudResultEvent;
import com.challenge.transaction.core.domain.model.Transaction;
import com.challenge.transaction.core.usecase.UpdateTransactionStatusService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@AllArgsConstructor
public class FraudResultConsumer {
    private final UpdateTransactionStatusService service;
    private final FraudResultProducer producer;

    @KafkaListener(topics = "transaction-created")
    public void consume(Transaction transaction) {
        String status;

        if (transaction.getValue() > 1000) {
            status = TransactionStatus.REJECTED.name();
        } else {
            status = TransactionStatus.APPROVED.name();
        }

        producer.publish(transaction.getTransactionExternalId().toString(), status);
    }

    @KafkaListener(topics = "transaction-validated")
    public void consume(FraudResultEvent event) {
        log.info("[TRANSACTION-VALIDATED] init...");
        log.info("[TRANSACTION-VALIDATED] transactionId: {}",event.getTransactionId());

        service.updateStatus(
                UUID.fromString(event.getTransactionId()),
                event.getStatus()
        );

        log.info("[TRANSACTION-VALIDATED] finished.");
    }

}
