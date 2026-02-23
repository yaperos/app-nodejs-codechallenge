package com.kafka.productor.infrastructure.messaging.kafka;

import java.lang.reflect.Field;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import com.kafka.productor.domain.model.Transaction;

@ExtendWith(MockitoExtension.class)
class TransactionKafkaProducerTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private TransactionKafkaProducer producer;

    @BeforeEach
    void setUp() throws Exception {
        Field field = TransactionKafkaProducer.class
                .getDeclaredField("topicCreated");
        field.setAccessible(true);
        field.set(producer, "transaction-created-topic");
    }

    @Test
    void shouldPublishTransactionCreatedEvent() {

        UUID id = UUID.randomUUID();

        Transaction transaction = mock(Transaction.class);
        when(transaction.getTransactionExternalId()).thenReturn(id);

        producer.publishTransactionCreated(transaction);

        verify(kafkaTemplate).send(
                eq("transaction-created-topic"),
                eq(id.toString()),
                eq(transaction)
        );
    }
}