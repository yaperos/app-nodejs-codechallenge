package com.yape.transactions.kafka;

import com.yape.transactions.dto.kafka.TransactionCreated;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionProducer {

    private final KafkaTemplate<String, TransactionCreated> kafkaTemplate;

    @Value("${spring.kafka.topic.transaction-created}")
    private String topicName;

    public void sendToValidation(TransactionCreated transaction) {
        log.info("Sending transaction {} for anti-fraud process", transaction.id());
        kafkaTemplate.send(topicName, transaction.id().toString(), transaction);
    }
}
