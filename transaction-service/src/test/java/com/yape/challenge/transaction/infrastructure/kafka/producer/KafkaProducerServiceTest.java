package com.yape.challenge.transaction.infrastructure.kafka.producer;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.kafka.KafkaTopics;
import com.yape.challenge.transaction.infrastructure.kafka.exception.KafkaProducerException;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
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
@DisplayName("Kafka Producer Service Tests")
class KafkaProducerServiceTest {

    @Mock
    private KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    @InjectMocks
    private KafkaProducerService kafkaProducerService;

    private UUID transactionId;
    private TransactionCreatedEvent event;
    private String topic;
    private String key;

    @BeforeEach
    void setUp() {
        transactionId = UUID.randomUUID();
        topic = KafkaTopics.TRANSACTION_CREATED;
        key = transactionId.toString();

        event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();
    }

    @Test
    @DisplayName("Should send event successfully")
    void shouldSendEventSuccessfully() throws Exception {
        // Given
        RecordMetadata metadata = new RecordMetadata(new TopicPartition(topic, 0), 0, 0, 0, 0, 0);
        SendResult<String, TransactionCreatedEvent> sendResult = mock(SendResult.class);
        when(sendResult.getRecordMetadata()).thenReturn(metadata);

        CompletableFuture<SendResult<String, TransactionCreatedEvent>> future =
                CompletableFuture.completedFuture(sendResult);

        when(kafkaTemplate.send(anyString(), anyString(), any(TransactionCreatedEvent.class)))
                .thenReturn(future);

        // When
        kafkaProducerService.sendTransactionCreatedEvent(topic, key, event);

        // Then
        verify(kafkaTemplate, times(1)).send(topic, key, event);
    }

    @Test
    @DisplayName("Should throw KafkaProducerException when send fails")
    void shouldThrowKafkaProducerExceptionWhenSendFails() {
        // Given
        CompletableFuture<SendResult<String, TransactionCreatedEvent>> future =
                CompletableFuture.failedFuture(new RuntimeException("Kafka unavailable"));

        when(kafkaTemplate.send(anyString(), anyString(), any(TransactionCreatedEvent.class)))
                .thenReturn(future);

        // When & Then
        assertThrows(KafkaProducerException.class, () ->
                kafkaProducerService.sendTransactionCreatedEvent(topic, key, event)
        );

        verify(kafkaTemplate, times(1)).send(topic, key, event);
    }

    @Test
    @DisplayName("Should handle interrupted exception")
    void shouldHandleInterruptedException() {
        // Given
        CompletableFuture<SendResult<String, TransactionCreatedEvent>> future = new CompletableFuture<>();
        future.completeExceptionally(new InterruptedException("Thread interrupted"));

        when(kafkaTemplate.send(anyString(), anyString(), any(TransactionCreatedEvent.class)))
                .thenReturn(future);

        // When & Then
        assertThrows(KafkaProducerException.class, () ->
                kafkaProducerService.sendTransactionCreatedEvent(topic, key, event)
        );

        verify(kafkaTemplate, times(1)).send(topic, key, event);
    }

    @Test
    @DisplayName("Should use correct topic and key")
    void shouldUseCorrectTopicAndKey() throws Exception {
        // Given
        RecordMetadata metadata = new RecordMetadata(new TopicPartition(topic, 0), 0, 0, 0, 0, 0);
        SendResult<String, TransactionCreatedEvent> sendResult = mock(SendResult.class);
        when(sendResult.getRecordMetadata()).thenReturn(metadata);

        CompletableFuture<SendResult<String, TransactionCreatedEvent>> future =
                CompletableFuture.completedFuture(sendResult);

        when(kafkaTemplate.send(eq(topic), eq(key), any(TransactionCreatedEvent.class)))
                .thenReturn(future);

        // When
        kafkaProducerService.sendTransactionCreatedEvent(topic, key, event);

        // Then
        verify(kafkaTemplate).send(eq(topic), eq(key), any(TransactionCreatedEvent.class));
    }

    @Test
    @DisplayName("Should send event with correct transaction data")
    void shouldSendEventWithCorrectTransactionData() throws Exception {
        // Given
        RecordMetadata metadata = new RecordMetadata(new TopicPartition(topic, 0), 0, 0, 0, 0, 0);
        SendResult<String, TransactionCreatedEvent> sendResult = mock(SendResult.class);
        when(sendResult.getRecordMetadata()).thenReturn(metadata);

        CompletableFuture<SendResult<String, TransactionCreatedEvent>> future =
                CompletableFuture.completedFuture(sendResult);

        when(kafkaTemplate.send(anyString(), anyString(), any(TransactionCreatedEvent.class)))
                .thenReturn(future);

        // When
        kafkaProducerService.sendTransactionCreatedEvent(topic, key, event);

        // Then
        verify(kafkaTemplate).send(anyString(), anyString(), argThat(evt ->
                evt.getTransactionExternalId().equals(transactionId) &&
                        evt.getValue().equals(new BigDecimal("500.00")) &&
                        evt.getTransferTypeId().equals(1)
        ));
    }
}

