package com.yape.antifraud.infrastructure.adapter.in.messaging;

import com.yape.antifraud.domain.port.in.EvaluateTransactionUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TransactionCreatedConsumer {

    private static final Logger log = LoggerFactory.getLogger(TransactionCreatedConsumer.class);

    private final EvaluateTransactionUseCase evaluateTransactionUseCase;

    public TransactionCreatedConsumer(EvaluateTransactionUseCase evaluateTransactionUseCase) {
        this.evaluateTransactionUseCase = evaluateTransactionUseCase;
    }

    @KafkaListener(
            topics = "${kafka.topics.transaction-created}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "transactionCreatedKafkaListenerContainerFactory"
    )
    public void onTransactionCreated(TransactionCreatedMessage message) {
        log.info("Anti-fraud received transaction: {} with value: {}",
                message.transactionExternalId(), message.value());

        evaluateTransactionUseCase.execute(
                new EvaluateTransactionUseCase.Command(
                        UUID.fromString(message.transactionExternalId()),
                        message.value()
                )
        );
    }
}
