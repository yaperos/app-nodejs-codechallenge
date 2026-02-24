package com.yape.transaction_service.producer;

import com.yape.shared.TransactionCreatedEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests del TransactionProducer")
class TransactionProducerTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Captor
    private ArgumentCaptor<String> topicCaptor;

    @Captor
    private ArgumentCaptor<String> keyCaptor;

    @Captor
    private ArgumentCaptor<TransactionCreatedEvent> eventCaptor;

    private TransactionProducer producer;

    @BeforeEach
    void setUp() {
        producer = new TransactionProducer(kafkaTemplate);
    }

    @Test
    @DisplayName("sendTransactionCreated - Debe enviar evento a Kafka")
    void shouldSendTransactionCreatedEvent() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = new TransactionCreatedEvent(
                transactionId, new BigDecimal("500.00")
        );

        CompletableFuture<SendResult<String, Object>> future =
                CompletableFuture.completedFuture(mock(SendResult.class));

        when(kafkaTemplate.send(
                eq("transaction-created"),
                eq(transactionId.toString()),
                any(TransactionCreatedEvent.class)
        )).thenReturn(future);

        producer.sendTransactionCreated(event);

        verify(kafkaTemplate).send(
                topicCaptor.capture(),
                keyCaptor.capture(),
                eventCaptor.capture()
        );

        assertEquals("transaction-created", topicCaptor.getValue());
        assertEquals(transactionId.toString(), keyCaptor.getValue());

        TransactionCreatedEvent capturedEvent = eventCaptor.getValue();
        assertEquals(transactionId, capturedEvent.transactionExternalId());
        assertEquals(new BigDecimal("500.00"), capturedEvent.value());
    }

    @Test
    @DisplayName("sendTransactionCreated - Debe manejar error de Kafka")
    void shouldHandleKafkaError() {
        UUID transactionId = UUID.randomUUID();
        TransactionCreatedEvent event = new TransactionCreatedEvent(
                transactionId, new BigDecimal("500.00")
        );

        CompletableFuture<SendResult<String, Object>> future = new CompletableFuture<>();
        future.completeExceptionally(new RuntimeException("Kafka error"));

        when(kafkaTemplate.send(
                eq("transaction-created"),
                eq(transactionId.toString()),
                any(TransactionCreatedEvent.class)
        )).thenReturn(future);

        assertDoesNotThrow(() -> producer.sendTransactionCreated(event));

        verify(kafkaTemplate).send(
                eq("transaction-created"),
                eq(transactionId.toString()),
                any(TransactionCreatedEvent.class)
        );
    }
}