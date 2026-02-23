package com.kafka.productor.infrastructure.messaging.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.port.EventPublisherPort;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionKafkaProducer implements EventPublisherPort {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topic-created}")
    private String topicCreated;

    @Override
    public void publishTransactionCreated(Transaction transaction) {
        kafkaTemplate.send(topicCreated, transaction.getTransactionExternalId().toString(), transaction);
    }
}
