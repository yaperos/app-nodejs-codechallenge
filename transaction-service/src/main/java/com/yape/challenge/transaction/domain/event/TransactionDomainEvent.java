package com.yape.challenge.transaction.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Base interface for all transaction domain events
 */
public interface TransactionDomainEvent {
    UUID getAggregateId();
    LocalDateTime getOccurredAt();
    String getEventType();
}


