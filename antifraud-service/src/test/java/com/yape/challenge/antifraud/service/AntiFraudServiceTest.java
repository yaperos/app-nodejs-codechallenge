package com.yape.challenge.antifraud.service;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.common.dto.TransactionStatusEvent;
import com.yape.challenge.common.kafka.KafkaTopics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AntiFraud Service Tests")
class AntiFraudServiceTest {

    @Mock
    private KafkaTemplate<String, TransactionStatusEvent> kafkaTemplate;

    @InjectMocks
    private AntiFraudService antiFraudService;

    @Captor
    private ArgumentCaptor<TransactionStatusEvent> statusEventCaptor;

    @Captor
    private ArgumentCaptor<String> topicCaptor;

    @Captor
    private ArgumentCaptor<String> keyCaptor;

    private UUID transactionId;

    @BeforeEach
    void setUp() {
        transactionId = UUID.randomUUID();
    }

    @Test
    @DisplayName("Should approve transaction when value is less than threshold")
    void shouldApproveTransactionWhenValueIsLessThanThreshold() {
        // Given
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();

        // When
        antiFraudService.validateTransaction(event);

        // Then
        verify(kafkaTemplate).send(topicCaptor.capture(), keyCaptor.capture(), statusEventCaptor.capture());

        assertEquals(KafkaTopics.TRANSACTION_STATUS_UPDATED, topicCaptor.getValue());
        assertEquals(transactionId.toString(), keyCaptor.getValue());

        TransactionStatusEvent statusEvent = statusEventCaptor.getValue();
        assertEquals(transactionId, statusEvent.getTransactionExternalId());
        assertEquals(TransactionStatus.APPROVED, statusEvent.getStatus());
    }

    @Test
    @DisplayName("Should approve transaction when value is exactly at threshold")
    void shouldApproveTransactionWhenValueIsAtThreshold() {
        // Given
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("1000.00"))
                .build();

        // When
        antiFraudService.validateTransaction(event);

        // Then
        verify(kafkaTemplate).send(anyString(), anyString(), statusEventCaptor.capture());

        TransactionStatusEvent statusEvent = statusEventCaptor.getValue();
        assertEquals(transactionId, statusEvent.getTransactionExternalId());
        assertEquals(TransactionStatus.APPROVED, statusEvent.getStatus());
    }

    @Test
    @DisplayName("Should reject transaction when value exceeds threshold")
    void shouldRejectTransactionWhenValueExceedsThreshold() {
        // Given
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("1000.01"))
                .build();

        // When
        antiFraudService.validateTransaction(event);

        // Then
        verify(kafkaTemplate).send(anyString(), anyString(), statusEventCaptor.capture());

        TransactionStatusEvent statusEvent = statusEventCaptor.getValue();
        assertEquals(transactionId, statusEvent.getTransactionExternalId());
        assertEquals(TransactionStatus.REJECTED, statusEvent.getStatus());
    }

    @Test
    @DisplayName("Should reject transaction when value is much higher than threshold")
    void shouldRejectTransactionWhenValueIsMuchHigherThanThreshold() {
        // Given
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("5000.00"))
                .build();

        // When
        antiFraudService.validateTransaction(event);

        // Then
        verify(kafkaTemplate).send(anyString(), anyString(), statusEventCaptor.capture());

        TransactionStatusEvent statusEvent = statusEventCaptor.getValue();
        assertEquals(transactionId, statusEvent.getTransactionExternalId());
        assertEquals(TransactionStatus.REJECTED, statusEvent.getStatus());
    }

    @Test
    @DisplayName("Should approve transaction with zero value")
    void shouldApproveTransactionWithZeroValue() {
        // Given
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(BigDecimal.ZERO)
                .build();

        // When
        antiFraudService.validateTransaction(event);

        // Then
        verify(kafkaTemplate).send(anyString(), anyString(), statusEventCaptor.capture());

        TransactionStatusEvent statusEvent = statusEventCaptor.getValue();
        assertEquals(TransactionStatus.APPROVED, statusEvent.getStatus());
    }

    @Test
    @DisplayName("Should use correct topic for publishing status event")
    void shouldUseCorrectTopicForPublishingStatusEvent() {
        // Given
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("100.00"))
                .build();

        // When
        antiFraudService.validateTransaction(event);

        // Then
        verify(kafkaTemplate).send(eq(KafkaTopics.TRANSACTION_STATUS_UPDATED), anyString(), any());
    }

    @Test
    @DisplayName("Should use transaction external id as kafka message key")
    void shouldUseTransactionExternalIdAsKafkaMessageKey() {
        // Given
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionExternalId(transactionId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("100.00"))
                .build();

        // When
        antiFraudService.validateTransaction(event);

        // Then
        verify(kafkaTemplate).send(anyString(), eq(transactionId.toString()), any());
    }
}

