package com.yape.challenge.transaction.infrastructure.eventstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.challenge.transaction.domain.entity.DomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionCreatedDomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionStatusChangedDomainEvent;
import com.yape.challenge.transaction.infrastructure.repository.DomainEventRepository;
import com.yape.challenge.common.dto.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Event Store Tests")
class EventStoreTest {

    @Mock
    private DomainEventRepository domainEventRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private EventStore eventStore;

    private UUID aggregateId;
    private TransactionCreatedDomainEvent createdEvent;
    private TransactionStatusChangedDomainEvent statusChangedEvent;

    @BeforeEach
    void setUp() {
        aggregateId = UUID.randomUUID();

        createdEvent = TransactionCreatedDomainEvent.builder()
                .aggregateId(aggregateId)
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .occurredAt(LocalDateTime.now())
                .build();

        statusChangedEvent = TransactionStatusChangedDomainEvent.builder()
                .aggregateId(aggregateId)
                .oldStatus(TransactionStatus.PENDING)
                .newStatus(TransactionStatus.APPROVED)
                .occurredAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should save transaction created event")
    void shouldSaveTransactionCreatedEvent() throws Exception {
        // Given
        when(domainEventRepository.findLastVersionByAggregateId(aggregateId))
                .thenReturn(Optional.empty());
        when(objectMapper.writeValueAsString(any())).thenReturn("{}");
        when(domainEventRepository.save(any(DomainEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        eventStore.saveEvent(createdEvent);

        // Then
        ArgumentCaptor<DomainEvent> eventCaptor = ArgumentCaptor.forClass(DomainEvent.class);
        verify(domainEventRepository).save(eventCaptor.capture());

        DomainEvent savedEvent = eventCaptor.getValue();
        assertEquals(aggregateId, savedEvent.getAggregateId());
        assertEquals("Transaction", savedEvent.getAggregateType());
        assertEquals(1, savedEvent.getVersion());
    }

    @Test
    @DisplayName("Should increment version when saving subsequent events")
    void shouldIncrementVersionWhenSavingSubsequentEvents() throws Exception {
        // Given
        when(domainEventRepository.findLastVersionByAggregateId(aggregateId))
                .thenReturn(Optional.of(2));
        when(objectMapper.writeValueAsString(any())).thenReturn("{}");
        when(domainEventRepository.save(any(DomainEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        eventStore.saveEvent(statusChangedEvent);

        // Then
        ArgumentCaptor<DomainEvent> eventCaptor = ArgumentCaptor.forClass(DomainEvent.class);
        verify(domainEventRepository).save(eventCaptor.capture());

        DomainEvent savedEvent = eventCaptor.getValue();
        assertEquals(3, savedEvent.getVersion());
    }

    @Test
    @DisplayName("Should throw exception when serialization fails")
    void shouldThrowExceptionWhenSerializationFails() throws Exception {
        // Given
        when(domainEventRepository.findLastVersionByAggregateId(aggregateId))
                .thenReturn(Optional.empty());
        when(objectMapper.writeValueAsString(any()))
                .thenThrow(new RuntimeException("Serialization error"));

        // When & Then
        assertThrows(RuntimeException.class, () ->
                eventStore.saveEvent(createdEvent)
        );

        verify(domainEventRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should save event with correct event type")
    void shouldSaveEventWithCorrectEventType() throws Exception {
        // Given
        when(domainEventRepository.findLastVersionByAggregateId(aggregateId))
                .thenReturn(Optional.empty());
        when(objectMapper.writeValueAsString(any())).thenReturn("{}");
        when(domainEventRepository.save(any(DomainEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        eventStore.saveEvent(createdEvent);

        // Then
        ArgumentCaptor<DomainEvent> eventCaptor = ArgumentCaptor.forClass(DomainEvent.class);
        verify(domainEventRepository).save(eventCaptor.capture());

        DomainEvent savedEvent = eventCaptor.getValue();
        assertEquals("TransactionCreatedDomainEvent", savedEvent.getEventType());
    }

    @Test
    @DisplayName("Should check if aggregate exists")
    void shouldCheckIfAggregateExists() {
        // Given
        when(domainEventRepository.existsByAggregateId(aggregateId)).thenReturn(true);

        // When
        boolean exists = eventStore.aggregateExists(aggregateId);

        // Then
        assertTrue(exists);
        verify(domainEventRepository).existsByAggregateId(aggregateId);
    }

    @Test
    @DisplayName("Should return false when aggregate does not exist")
    void shouldReturnFalseWhenAggregateDoesNotExist() {
        // Given
        when(domainEventRepository.existsByAggregateId(aggregateId)).thenReturn(false);

        // When
        boolean exists = eventStore.aggregateExists(aggregateId);

        // Then
        assertFalse(exists);
        verify(domainEventRepository).existsByAggregateId(aggregateId);
    }

    @Test
    @DisplayName("Should get event count for aggregate")
    void shouldGetEventCountForAggregate() {
        // Given
        when(domainEventRepository.countByAggregateId(aggregateId)).thenReturn(5L);

        // When
        long count = eventStore.getEventCount(aggregateId);

        // Then
        assertEquals(5L, count);
        verify(domainEventRepository).countByAggregateId(aggregateId);
    }

    @Test
    @DisplayName("Should return zero when no events exist for aggregate")
    void shouldReturnZeroWhenNoEventsExistForAggregate() {
        // Given
        when(domainEventRepository.countByAggregateId(aggregateId)).thenReturn(0L);

        // When
        long count = eventStore.getEventCount(aggregateId);

        // Then
        assertEquals(0L, count);
        verify(domainEventRepository).countByAggregateId(aggregateId);
    }
}

