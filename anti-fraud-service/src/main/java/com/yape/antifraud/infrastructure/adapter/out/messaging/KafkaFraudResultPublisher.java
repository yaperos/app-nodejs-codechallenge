package com.yape.antifraud.infrastructure.adapter.out.messaging;

import com.yape.antifraud.domain.model.FraudEvaluation;
import com.yape.antifraud.domain.port.out.FraudResultPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaFraudResultPublisher implements FraudResultPublisher {

    private static final Logger log = LoggerFactory.getLogger(KafkaFraudResultPublisher.class);

    private final KafkaTemplate<String, TransactionStatusUpdatedEvent> kafkaTemplate;

    @Value("${kafka.topics.transaction-status-updated}")
    private String transactionStatusUpdatedTopic;

    public KafkaFraudResultPublisher(KafkaTemplate<String, TransactionStatusUpdatedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishResult(FraudEvaluation evaluation) {
        TransactionStatusUpdatedEvent event = new TransactionStatusUpdatedEvent(
                evaluation.getTransactionExternalId().toString(),
                evaluation.getResult().name()
        );

        kafkaTemplate.send(
                transactionStatusUpdatedTopic,
                evaluation.getTransactionExternalId().toString(),
                event
        ).whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish fraud result for transaction: {}",
                        evaluation.getTransactionExternalId(), ex);
            } else {
                log.info("Fraud result {} published for transaction: {}",
                        evaluation.getResult(), evaluation.getTransactionExternalId());
            }
        });
    }
}
