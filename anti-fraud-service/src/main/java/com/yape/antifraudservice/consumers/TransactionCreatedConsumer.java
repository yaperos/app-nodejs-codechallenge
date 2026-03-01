package com.yape.antifraudservice.consumers;

import com.yape.antifraudservice.enums.TransactionStatus;
import com.yape.antifraudservice.models.TransactionEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class TransactionCreatedConsumer {
    private final KafkaTemplate<String, TransactionEvent> kafkaTemplate;

    public TransactionCreatedConsumer(KafkaTemplate<String, TransactionEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "transaction.created")
    public void onTransactionCreated(TransactionEvent transaction) {
        TransactionStatus status = transaction.value().compareTo(BigDecimal.valueOf(1000)) > 0
                ? TransactionStatus.REJECTED
                : TransactionStatus.APPROVED;

        TransactionEvent response = new TransactionEvent(
                transaction.transactionExternalId(),
                status,
                transaction.value()
        );

        kafkaTemplate.send("transaction.status", transaction.transactionExternalId().toString(), response);

    }

}
