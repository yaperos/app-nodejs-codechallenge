package com.kafka.anti_fraude.infrastructure.messaging.kafka;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import com.kafka.anti_fraude.infrastructure.messaging.dto.TransactionUpdatedEvent;

class KafkaTransactionPublisherTest {

    private KafkaTemplate<String, TransactionUpdatedEvent> kafkaTemplate;
    private KafkaTransactionPublisher publisher;

    @BeforeEach
    void setup() {
        kafkaTemplate = mock(KafkaTemplate.class);
        publisher = new KafkaTransactionPublisher(kafkaTemplate);
        ReflectionTestUtils.setField(publisher, "topicUpdate", "test-topic");
    }

    @Test
    void publishStatusUpdate_shouldSendEvent() {
        UUID transactionId = UUID.randomUUID();
        publisher.publishStatusUpdate(transactionId, "APPROVED");

        verify(kafkaTemplate).send(eq("test-topic"), eq(transactionId.toString()), any(TransactionUpdatedEvent.class));
    }
}