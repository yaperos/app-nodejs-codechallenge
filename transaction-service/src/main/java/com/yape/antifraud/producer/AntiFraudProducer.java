package com.yape.antifraud.producer;

import com.yape.shared.TransactionValidatedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class AntiFraudProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public AntiFraudProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendValidationResult(TransactionValidatedEvent event) {
        kafkaTemplate.send("transaction-validated", event);
    }
}
