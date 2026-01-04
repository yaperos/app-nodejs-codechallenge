package com.yape.challenge.transaction.domain.service;

import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.transaction.domain.entity.Transaction;
import com.yape.challenge.transaction.domain.event.TransactionCreatedDomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionDomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionStatusChangedDomainEvent;
import com.yape.challenge.transaction.infrastructure.eventstore.EventStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Transaction Aggregate Service Tests")
class TransactionAggregateServiceTest {

    @Mock
    private EventStore eventStore;

    @InjectMocks
    private TransactionAggregateService transactionAggregateService;

    private UUID transactionId;
    private UUID debitAccountId;
    private UUID creditAccountId;

    @BeforeEach
    void setUp() {
        transactionId = UUID.randomUUID();
        debitAccountId = UUID.randomUUID();
        creditAccountId = UUID.randomUUID();
    }

    @Test
    @DisplayName("Should rebuild transaction from creation event")
    void shouldRebuildTransactionFromCreationEvent() {
        // Given
        TransactionCreatedDomainEvent createdEvent = TransactionCreatedDomainEvent.builder()
                .aggregateId(transactionId)
                .accountExternalIdDebit(debitAccountId)
                .accountExternalIdCredit(creditAccountId)
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .occurredAt(LocalDateTime.now())
                .build();

        when(eventStore.getEvents(transactionId))
                .thenReturn(Collections.singletonList(createdEvent));

        // When
        Transaction transaction = transactionAggregateService.rebuildFromEvents(transactionId);

        // Then
        assertNotNull(transaction);
        assertEquals(transactionId, transaction.getExternalId());
        assertEquals(debitAccountId, transaction.getAccountExternalIdDebit());
        assertEquals(creditAccountId, transaction.getAccountExternalIdCredit());
        assertEquals(1, transaction.getTransferTypeId());
        assertEquals(new BigDecimal("500.00"), transaction.getValue());
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
        verify(eventStore).getEvents(transactionId);
    }

    @Test
    @DisplayName("Should rebuild transaction from multiple events")
    void shouldRebuildTransactionFromMultipleEvents() {
        // Given
        LocalDateTime createdAt = LocalDateTime.now().minusMinutes(5);
        LocalDateTime updatedAt = LocalDateTime.now();

        TransactionCreatedDomainEvent createdEvent = TransactionCreatedDomainEvent.builder()
                .aggregateId(transactionId)
                .accountExternalIdDebit(debitAccountId)
                .accountExternalIdCredit(creditAccountId)
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .occurredAt(createdAt)
                .build();

        TransactionStatusChangedDomainEvent statusChangedEvent = TransactionStatusChangedDomainEvent.builder()
                .aggregateId(transactionId)
                .oldStatus(TransactionStatus.PENDING)
                .newStatus(TransactionStatus.APPROVED)
                .occurredAt(updatedAt)
                .build();

        List<TransactionDomainEvent> events = Arrays.asList(createdEvent, statusChangedEvent);
        when(eventStore.getEvents(transactionId)).thenReturn(events);

        // When
        Transaction transaction = transactionAggregateService.rebuildFromEvents(transactionId);

        // Then
        assertNotNull(transaction);
        assertEquals(transactionId, transaction.getExternalId());
        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
        assertEquals(updatedAt, transaction.getUpdatedAt());
        verify(eventStore).getEvents(transactionId);
    }

    @Test
    @DisplayName("Should throw exception when no events found")
    void shouldThrowExceptionWhenNoEventsFound() {
        // Given
        when(eventStore.getEvents(transactionId)).thenReturn(Collections.emptyList());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                transactionAggregateService.rebuildFromEvents(transactionId)
        );

        assertTrue(exception.getMessage().contains("No events found"));
        verify(eventStore).getEvents(transactionId);
    }

    @Test
    @DisplayName("Should apply creation event correctly")
    void shouldApplyCreationEventCorrectly() {
        // Given
        Transaction transaction = new Transaction();
        transaction.setExternalId(transactionId);

        TransactionCreatedDomainEvent event = TransactionCreatedDomainEvent.builder()
                .aggregateId(transactionId)
                .accountExternalIdDebit(debitAccountId)
                .accountExternalIdCredit(creditAccountId)
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .occurredAt(LocalDateTime.now())
                .build();

        // When
        transactionAggregateService.applyEvent(transaction, event);

        // Then
        assertEquals(debitAccountId, transaction.getAccountExternalIdDebit());
        assertEquals(creditAccountId, transaction.getAccountExternalIdCredit());
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
    }

    @Test
    @DisplayName("Should apply status changed event correctly")
    void shouldApplyStatusChangedEventCorrectly() {
        // Given
        Transaction transaction = new Transaction();
        transaction.setExternalId(transactionId);
        transaction.setStatus(TransactionStatus.PENDING);

        LocalDateTime updatedAt = LocalDateTime.now();
        TransactionStatusChangedDomainEvent event = TransactionStatusChangedDomainEvent.builder()
                .aggregateId(transactionId)
                .oldStatus(TransactionStatus.PENDING)
                .newStatus(TransactionStatus.APPROVED)
                .occurredAt(updatedAt)
                .build();

        // When
        transactionAggregateService.applyEvent(transaction, event);

        // Then
        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
        assertEquals(updatedAt, transaction.getUpdatedAt());
    }

    @Test
    @DisplayName("Should check if transaction exists")
    void shouldCheckIfTransactionExists() {
        // Given
        when(eventStore.aggregateExists(transactionId)).thenReturn(true);

        // When
        boolean exists = transactionAggregateService.transactionExists(transactionId);

        // Then
        assertTrue(exists);
        verify(eventStore).aggregateExists(transactionId);
    }

    @Test
    @DisplayName("Should return false when transaction does not exist")
    void shouldReturnFalseWhenTransactionDoesNotExist() {
        // Given
        when(eventStore.aggregateExists(transactionId)).thenReturn(false);

        // When
        boolean exists = transactionAggregateService.transactionExists(transactionId);

        // Then
        assertFalse(exists);
        verify(eventStore).aggregateExists(transactionId);
    }

    @Test
    @DisplayName("Should get event count")
    void shouldGetEventCount() {
        // Given
        when(eventStore.getEventCount(transactionId)).thenReturn(3L);

        // When
        long count = transactionAggregateService.getEventCount(transactionId);

        // Then
        assertEquals(3L, count);
        verify(eventStore).getEventCount(transactionId);
    }

    @Test
    @DisplayName("Should rebuild transaction with status changes from pending to rejected")
    void shouldRebuildTransactionWithStatusChangesToRejected() {
        // Given
        TransactionCreatedDomainEvent createdEvent = TransactionCreatedDomainEvent.builder()
                .aggregateId(transactionId)
                .accountExternalIdDebit(debitAccountId)
                .accountExternalIdCredit(creditAccountId)
                .transferTypeId(1)
                .value(new BigDecimal("2000.00"))
                .occurredAt(LocalDateTime.now().minusMinutes(5))
                .build();

        TransactionStatusChangedDomainEvent statusChangedEvent = TransactionStatusChangedDomainEvent.builder()
                .aggregateId(transactionId)
                .oldStatus(TransactionStatus.PENDING)
                .newStatus(TransactionStatus.REJECTED)
                .occurredAt(LocalDateTime.now())
                .build();

        when(eventStore.getEvents(transactionId))
                .thenReturn(Arrays.asList(createdEvent, statusChangedEvent));

        // When
        Transaction transaction = transactionAggregateService.rebuildFromEvents(transactionId);

        // Then
        assertEquals(TransactionStatus.REJECTED, transaction.getStatus());
        verify(eventStore).getEvents(transactionId);
    }
}

