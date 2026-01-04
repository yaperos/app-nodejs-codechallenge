package com.yape.challenge.transaction.domain.service;

import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.transaction.domain.entity.Transaction;
import com.yape.challenge.transaction.domain.event.TransactionCreatedDomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionDomainEvent;
import com.yape.challenge.transaction.domain.event.TransactionStatusChangedDomainEvent;
import com.yape.challenge.transaction.infrastructure.eventstore.EventStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service to rebuild Transaction aggregates from domain events
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionAggregateService {

    private final EventStore eventStore;

    /**
     * Rebuild a transaction aggregate from its event history
     */
    public Transaction rebuildFromEvents(UUID transactionId) {
        log.info("Rebuilding transaction aggregate from events: {}", transactionId);

        List<TransactionDomainEvent> events = eventStore.getEvents(transactionId);

        if (events.isEmpty()) {
            throw new IllegalArgumentException("No events found for transaction: " + transactionId);
        }

        Transaction transaction = new Transaction();
        transaction.setExternalId(transactionId);

        // Apply each event in order
        for (TransactionDomainEvent event : events) {
            applyEvent(transaction, event);
        }

        log.info("Transaction aggregate rebuilt successfully: {}", transactionId);
        return transaction;
    }

    /**
     * Apply a single event to the transaction aggregate
     */
    public void applyEvent(Transaction transaction, TransactionDomainEvent event) {
        switch (event) {
            case TransactionCreatedDomainEvent created -> {
                transaction.setAccountExternalIdDebit(created.getAccountExternalIdDebit());
                transaction.setAccountExternalIdCredit(created.getAccountExternalIdCredit());
                transaction.setTransferTypeId(created.getTransferTypeId());
                transaction.setValue(created.getValue());
                transaction.setStatus(TransactionStatus.PENDING);
                transaction.setCreatedAt(created.getOccurredAt());
                transaction.setUpdatedAt(created.getOccurredAt());
                log.debug("Applied TransactionCreatedDomainEvent to aggregate: {}", transaction.getExternalId());
            }
            case TransactionStatusChangedDomainEvent statusChanged -> {
                transaction.setStatus(statusChanged.getNewStatus());
                transaction.setUpdatedAt(statusChanged.getOccurredAt());
                log.debug("Applied TransactionStatusChangedDomainEvent to aggregate: {} - New status: {}",
                        transaction.getExternalId(), statusChanged.getNewStatus());
            }
            default ->
                    log.warn("Unknown event type: {}", event.getClass().getName());
        }
    }

    /**
     * Check if a transaction exists in the event store
     */
    public boolean transactionExists(UUID transactionId) {
        return eventStore.aggregateExists(transactionId);
    }

    /**
     * Get the number of events for a transaction
     */
    public long getEventCount(UUID transactionId) {
        return eventStore.getEventCount(transactionId);
    }
}

