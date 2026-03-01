package com.retotecnico.antifraud.infrastructure.adapter.messaging;

import com.retotecnico.common.event.TransactionStatusEvent;
import com.retotecnico.antifraud.domain.port.out.FraudResultPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Kafka producer - publishes fraud validation results.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaFraudResultPublisher implements FraudResultPublisher {

    private static final String TOPIC = "transaction-status";

    private final KafkaTemplate<String, TransactionStatusEvent> kafkaTemplate;

    @Override
    public void publishResult(UUID transactionExternalId, String status) {
        TransactionStatusEvent event = TransactionStatusEvent.builder()
                .transactionExternalId(transactionExternalId)
                .status(status)
                .build();

        kafkaTemplate.send(TOPIC, transactionExternalId.toString(), event);
        log.info("Published transaction-status event: id={}, status={}", transactionExternalId, status);
    }
}
