package com.yape.yape.infrastructure.adapter.out.kafka;

import com.yape.yape.domain.port.EventPublisherPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventPublisherAdapter implements EventPublisherPort {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topics.transaction-created}")
    private String transactionCreatedTopic;

    @Value("${app.kafka.topics.transaction-approved}")
    private String transactionApprovedTopic;

    @Value("${app.kafka.topics.transaction-rejected}")
    private String transactionRejectedTopic;

    public KafkaEventPublisherAdapter(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void publishTransactionCreated(Object event) {
        kafkaTemplate.send(transactionCreatedTopic, event);
    }

    @Override
    public void publishTransactionApproved(Object event) {
        kafkaTemplate.send(transactionApprovedTopic, event);
    }

    @Override
    public void publishTransactionRejected(Object event) {
        kafkaTemplate.send(transactionRejectedTopic, event);
    }
}
