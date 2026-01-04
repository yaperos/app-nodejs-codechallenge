package com.yape.challenge.transaction.presentation.controller;

import com.yape.challenge.transaction.domain.event.TransactionDomainEvent;
import com.yape.challenge.transaction.infrastructure.eventstore.EventStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Event Store queries (for debugging and auditing)
 */
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@Slf4j
public class EventStoreController {

    private final EventStore eventStore;

    /**
     * Get all events for a specific transaction
     * GET /api/v1/events/transaction/{transactionId}
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<List<TransactionDomainEvent>> getTransactionEvents(
            @PathVariable UUID transactionId) {
        log.info("Getting events for transaction: {}", transactionId);

        List<TransactionDomainEvent> events = eventStore.getEvents(transactionId);

        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    /**
     * Get event count for a specific transaction
     * GET /api/v1/events/transaction/{transactionId}/count
     */
    @GetMapping("/transaction/{transactionId}/count")
    public ResponseEntity<Long> getTransactionEventCount(@PathVariable UUID transactionId) {
        log.info("Getting event count for transaction: {}", transactionId);

        long count = eventStore.getEventCount(transactionId);

        return ResponseEntity.ok(count);
    }

    /**
     * Get all events by event type
     * GET /api/v1/events/type/{eventType}
     */
    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<TransactionDomainEvent>> getEventsByType(
            @PathVariable String eventType) {
        log.info("Getting events by type: {}", eventType);

        List<TransactionDomainEvent> events = eventStore.getEventsByType(eventType);

        return ResponseEntity.ok(events);
    }

    /**
     * Get all transaction events
     * GET /api/v1/events/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<TransactionDomainEvent>> getAllEvents() {
        log.info("Getting all transaction events");

        List<TransactionDomainEvent> events = eventStore.getAllTransactionEvents();

        return ResponseEntity.ok(events);
    }

    /**
     * Check if transaction exists in event store
     * GET /api/v1/events/transaction/{transactionId}/exists
     */
    @GetMapping("/transaction/{transactionId}/exists")
    public ResponseEntity<Boolean> transactionExists(@PathVariable UUID transactionId) {
        log.info("Checking if transaction exists in event store: {}", transactionId);

        boolean exists = eventStore.aggregateExists(transactionId);

        return ResponseEntity.ok(exists);
    }
}

