package com.yape.challenge.transaction.infrastructure.eventstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.challenge.transaction.domain.entity.DomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionCreatedDomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionDomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionStatusChangedDomainEvent;
import com.yape.challenge.transaction.infrastructure.repository.DomainEventRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Event Store implementation for persisting and retrieving domain events
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EventStore {

    private final DomainEventRepository domainEventRepository;
    private final ObjectMapper objectMapper;

    private static final String AGGREGATE_TYPE = "Transaction";

    /**
     * Save a domain event to the event store
     */
    @Transactional
    @CircuitBreaker(name = "database", fallbackMethod = "saveEventFallback")
    public void saveEvent(TransactionDomainEvent event) {
        try {
            UUID aggregateId = event.getAggregateId();

            // Get the last version for this aggregate
            Integer lastVersion = domainEventRepository
                    .findLastVersionByAggregateId(aggregateId)
                    .orElse(0);

            // Serialize event data to JSON
            String eventData = objectMapper.writeValueAsString(event);

            // Create metadata
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("timestamp", LocalDateTime.now());
            metadata.put("eventClass", event.getClass().getName());
            String metadataJson = objectMapper.writeValueAsString(metadata);

            // Create and save domain event
            DomainEvent domainEvent = DomainEvent.builder()
                    .aggregateId(aggregateId)
                    .aggregateType(AGGREGATE_TYPE)
                    .eventType(event.getEventType())
                    .eventData(eventData)
                    .metadata(metadataJson)
                    .version(lastVersion + 1)
                    .occurredAt(event.getOccurredAt())
                    .build();

            domainEventRepository.save(domainEvent);
            log.info("Event saved: {} for aggregate: {}, version: {}",
                    event.getEventType(), aggregateId, lastVersion + 1);

        } catch (JsonProcessingException e) {
            log.error("Error serializing event: {}", event, e);
            throw new RuntimeException("Failed to serialize event", e);
        }
    }

    /**
     * Fallback method for saveEvent when database is not available
     */
    private void saveEventFallback(TransactionDomainEvent event, Exception e) {
        log.error("Database circuit breaker is OPEN or error occurred. Event: {}, Error: {}",
                event.getAggregateId(), e.getMessage());
        throw new RuntimeException("Database service is currently unavailable. Please try again later.", e);
    }

    /**
     * Get all events for a specific aggregate
     */
    @Transactional(readOnly = true)
    @CircuitBreaker(name = "database", fallbackMethod = "getEventsFallback")
    public List<TransactionDomainEvent> getEvents(UUID aggregateId) {
        List<DomainEvent> domainEvents = domainEventRepository
                .findByAggregateIdOrderByVersionAsc(aggregateId);

        return domainEvents.stream()
                .map(this::deserializeEvent)
                .toList();
    }

    /**
     * Fallback method for getEvents when database is not available
     */
    private List<TransactionDomainEvent> getEventsFallback(UUID aggregateId, Exception e) {
        log.error("Database circuit breaker is OPEN or error occurred. Aggregate: {}, Error: {}",
                aggregateId, e.getMessage());
        throw new RuntimeException("Database service is currently unavailable. Please try again later.", e);
    }

    /**
     * Check if an aggregate exists in the event store
     */
    @Transactional(readOnly = true)
    public boolean aggregateExists(UUID aggregateId) {
        return domainEventRepository.existsByAggregateId(aggregateId);
    }

    /**
     * Get event count for an aggregate
     */
    @Transactional(readOnly = true)
    public long getEventCount(UUID aggregateId) {
        return domainEventRepository.countByAggregateId(aggregateId);
    }

    /**
     * Deserialize a domain event from JSON
     */
    private TransactionDomainEvent deserializeEvent(DomainEvent domainEvent) {
        try {
            String eventType = domainEvent.getEventType();
            String eventData = domainEvent.getEventData();

            return switch (eventType) {
                case "TransactionCreatedDomainEvent" ->
                        objectMapper.readValue(eventData, TransactionCreatedDomainEvent.class);
                case "TransactionStatusChangedDomainEvent" ->
                        objectMapper.readValue(eventData, TransactionStatusChangedDomainEvent.class);
                default -> {
                    log.error("Unknown event type: {}", eventType);
                    throw new IllegalArgumentException("Unknown event type: " + eventType);
                }
            };
        } catch (JsonProcessingException e) {
            log.error("Error deserializing event: {}", domainEvent, e);
            throw new RuntimeException("Failed to deserialize event", e);
        }
    }

    /**
     * Get all events by type
     */
    @Transactional(readOnly = true)
    public List<TransactionDomainEvent> getEventsByType(String eventType) {
        return domainEventRepository.findByEventTypeOrderByOccurredAtDesc(eventType)
                .stream()
                .map(this::deserializeEvent)
                .toList();
    }

    /**
     * Get all events for the aggregate type
     */
    @Transactional(readOnly = true)
    public List<TransactionDomainEvent> getAllTransactionEvents() {
        return domainEventRepository.findByAggregateTypeOrderByOccurredAtDesc(AGGREGATE_TYPE)
                .stream()
                .map(this::deserializeEvent)
                .toList();
    }
}

