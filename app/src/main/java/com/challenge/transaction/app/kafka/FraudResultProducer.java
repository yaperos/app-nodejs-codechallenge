package com.challenge.transaction.app.kafka;

import com.challenge.transaction.core.domain.event.FraudResultEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FraudResultProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(String transactionId, String status) {
        log.info("[FRAUD-VALIDATION] init...");
        log.info("[FRAUD-VALIDATION] transactionId = {}", transactionId);

        FraudResultEvent event = new FraudResultEvent();
        event.setTransactionId(transactionId);
        event.setStatus(status);

        kafkaTemplate.send("transaction-validated", event);

        log.info("[FRAUD-VALIDATION] valid finish.");
    }
}
