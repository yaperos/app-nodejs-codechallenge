package com.yape.challenge.antifraud.kafka;

import com.yape.challenge.antifraud.service.AntiFraudService;
import com.yape.challenge.common.dto.TransactionCreatedEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Transaction Created Consumer Tests")
class TransactionCreatedConsumerTest {

    @Mock
    private AntiFraudService antiFraudService;

    @InjectMocks
    private TransactionCreatedConsumer transactionCreatedConsumer;

    private TransactionCreatedEvent event;

    @BeforeEach
    void setUp() {
        event = TransactionCreatedEvent.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();
    }

    @Test
    @DisplayName("Should successfully consume and process transaction created event")
    void shouldSuccessfullyConsumeAndProcessTransactionCreatedEvent() {
        // Given
        doNothing().when(antiFraudService).validateTransaction(any(TransactionCreatedEvent.class));

        // When
        transactionCreatedConsumer.consumeTransactionCreated(event);

        // Then
        verify(antiFraudService, times(1)).validateTransaction(event);
    }

    @Test
    @DisplayName("Should propagate exception when validation fails")
    void shouldPropagateExceptionWhenValidationFails() {
        // Given
        RuntimeException exception = new RuntimeException("Validation failed");
        doThrow(exception).when(antiFraudService).validateTransaction(any(TransactionCreatedEvent.class));

        // When & Then
        RuntimeException thrown = assertThrows(RuntimeException.class, () ->
                transactionCreatedConsumer.consumeTransactionCreated(event)
        );

        assertEquals("Validation failed", thrown.getMessage());
        verify(antiFraudService, times(1)).validateTransaction(event);
    }

    @Test
    @DisplayName("Should call validate transaction with correct event data")
    void shouldCallValidateTransactionWithCorrectEventData() {
        // Given
        doNothing().when(antiFraudService).validateTransaction(any(TransactionCreatedEvent.class));

        // When
        transactionCreatedConsumer.consumeTransactionCreated(event);

        // Then
        verify(antiFraudService).validateTransaction(argThat(e ->
                e.getTransactionExternalId().equals(event.getTransactionExternalId()) &&
                        e.getAccountExternalIdDebit().equals(event.getAccountExternalIdDebit()) &&
                        e.getAccountExternalIdCredit().equals(event.getAccountExternalIdCredit()) &&
                        e.getValue().equals(event.getValue())
        ));
    }

    @Test
    @DisplayName("Should handle multiple consecutive events")
    void shouldHandleMultipleConsecutiveEvents() {
        // Given
        TransactionCreatedEvent event1 = TransactionCreatedEvent.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("100.00"))
                .build();

        TransactionCreatedEvent event2 = TransactionCreatedEvent.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("200.00"))
                .build();

        doNothing().when(antiFraudService).validateTransaction(any(TransactionCreatedEvent.class));

        // When
        transactionCreatedConsumer.consumeTransactionCreated(event1);
        transactionCreatedConsumer.consumeTransactionCreated(event2);

        // Then
        verify(antiFraudService, times(2)).validateTransaction(any(TransactionCreatedEvent.class));
        verify(antiFraudService).validateTransaction(event1);
        verify(antiFraudService).validateTransaction(event2);
    }
}

