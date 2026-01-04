package com.yape.challenge.transaction.application.handler.command;

import com.yape.challenge.transaction.application.command.UpdateTransactionStatusCommand;
import com.yape.challenge.transaction.application.handler.CommandHandler;
import com.yape.challenge.transaction.domain.entity.Transaction;
import com.yape.challenge.transaction.domain.event.TransactionStatusChangedDomainEvent;
import com.yape.challenge.transaction.infrastructure.eventstore.EventStore;
import com.yape.challenge.transaction.infrastructure.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Handler for UpdateTransactionStatusCommand with Event Sourcing
 * Implements cache invalidation for consistency
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UpdateTransactionStatusCommandHandler implements CommandHandler<UpdateTransactionStatusCommand, Void> {

    private final EventStore eventStore;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    @CacheEvict(value = "transactions", key = "#command.externalId.toString()")
    public Void handle(UpdateTransactionStatusCommand command) {
        log.info("Handling UpdateTransactionStatusCommand with Event Sourcing: {}", command);

        // 1. Get current transaction state
        Transaction transaction = transactionRepository.findByExternalId(command.getExternalId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + command.getExternalId()));

        // 2. Check if status actually changed
        if (transaction.getStatus() == command.getStatus()) {
            log.info("Transaction status unchanged: {}", command.getStatus());
            return null;
        }

        // 3. Create domain event for status change
        TransactionStatusChangedDomainEvent domainEvent = TransactionStatusChangedDomainEvent.builder()
                .aggregateId(command.getExternalId())
                .oldStatus(transaction.getStatus())
                .newStatus(command.getStatus())
                .reason("Status updated via antifraud validation")
                .occurredAt(LocalDateTime.now())
                .build();

        // 4. Save event to Event Store (persistence)
        eventStore.saveEvent(domainEvent);
        log.info("Domain event persisted in Event Store for transaction: {} - Status change: {} -> {}",
                command.getExternalId(), domainEvent.getOldStatus(), domainEvent.getNewStatus());

        // 5. Apply event to update aggregate and save read model
        transaction.setStatus(command.getStatus());
        transaction.setUpdatedAt(domainEvent.getOccurredAt());
        transactionRepository.save(transaction);

        log.info("Transaction status updated successfully and cache invalidated for externalId: {} - New status: {}",
                command.getExternalId(), command.getStatus());

        return null;
    }
}

