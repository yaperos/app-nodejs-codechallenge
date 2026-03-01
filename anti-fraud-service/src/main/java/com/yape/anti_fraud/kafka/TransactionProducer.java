package com.yape.anti_fraud.kafka;

import com.yape.anti_fraud.dto.kafka.TransactionValidated;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionProducer {

    private final KafkaTemplate<String, TransactionValidated> kafkaTemplate;

    @Value("${spring.kafka.topic.transaction-validated}")
    private String topicName;

    public void sendStatus(TransactionValidated event) {
        log.info("Sending status for transaction {}", event.id());
        kafkaTemplate.send(topicName, event.id().toString(), event);
    }
}
