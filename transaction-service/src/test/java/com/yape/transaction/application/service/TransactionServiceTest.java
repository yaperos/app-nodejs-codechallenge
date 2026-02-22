package com.yape.transaction.application.service;

import com.yape.transaction.domain.event.TransactionCreatedEvent;
import com.yape.transaction.domain.exception.TransactionNotFoundException;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.CreateTransactionCommand;
import com.yape.transaction.domain.port.in.UpdateTransactionStatusCommand;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TransactionServiceTest {

    @Test
    void shouldCreateTransactionAndPublishEvent() {
        InMemoryTransactionRepository repository = new InMemoryTransactionRepository();
        CapturingEventPublisher publisher = new CapturingEventPublisher();
        CreateTransactionService service = new CreateTransactionService(repository, publisher);

        var command = new CreateTransactionCommand(
                UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("500.00"));

        Transaction result = service.execute(command);

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(TransactionStatus.PENDING);
        assertThat(result.getValue()).isEqualByComparingTo(new BigDecimal("500.00"));
        assertThat(repository.store).hasSize(1);
        assertThat(publisher.sentEvents).hasSize(1);
    }

    @Test
    void shouldGetTransactionById() {
        InMemoryTransactionRepository repository = new InMemoryTransactionRepository();
        GetTransactionService service = new GetTransactionService(repository);

        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        repository.save(transaction);

        Transaction result = service.execute(transaction.getId());

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(transaction.getId());
    }

    @Test
    void shouldThrowWhenTransactionNotFound() {
        InMemoryTransactionRepository repository = new InMemoryTransactionRepository();
        GetTransactionService service = new GetTransactionService(repository);

        UUID id = UUID.randomUUID();
        assertThatThrownBy(() -> service.execute(id))
                .isInstanceOf(TransactionNotFoundException.class);
    }

    @Test
    void shouldUpdateStatusToApproved() {
        InMemoryTransactionRepository repository = new InMemoryTransactionRepository();
        UpdateTransactionStatusService service = new UpdateTransactionStatusService(repository);

        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        repository.save(transaction);

        service.execute(new UpdateTransactionStatusCommand(transaction.getId(), TransactionStatus.APPROVED));

        Transaction updated = repository.findById(transaction.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(TransactionStatus.APPROVED);
    }

    @Test
    void shouldUpdateStatusToRejected() {
        InMemoryTransactionRepository repository = new InMemoryTransactionRepository();
        UpdateTransactionStatusService service = new UpdateTransactionStatusService(repository);

        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("2000"));
        repository.save(transaction);

        service.execute(new UpdateTransactionStatusCommand(transaction.getId(), TransactionStatus.REJECTED));

        Transaction updated = repository.findById(transaction.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(TransactionStatus.REJECTED);
    }

    @Test
    void shouldSkipUpdateWhenTransactionNotPending() {
        InMemoryTransactionRepository repository = new InMemoryTransactionRepository();
        UpdateTransactionStatusService service = new UpdateTransactionStatusService(repository);

        Transaction transaction = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        transaction.approve();
        repository.save(transaction);

        service.execute(new UpdateTransactionStatusCommand(transaction.getId(), TransactionStatus.APPROVED));

        assertThat(transaction.getStatus()).isEqualTo(TransactionStatus.APPROVED);
    }

    static class CapturingEventPublisher implements TransactionEventPublisher {
        final List<TransactionCreatedEvent> sentEvents = new ArrayList<>();

        @Override
        public void publishTransactionCreated(TransactionCreatedEvent event) {
            sentEvents.add(event);
        }
    }

    static class InMemoryTransactionRepository implements TransactionRepository {
        final Map<UUID, Transaction> store = new HashMap<>();

        @Override
        public Transaction save(Transaction entity) {
            store.put(entity.getId(), entity);
            return entity;
        }

        @Override
        public Optional<Transaction> findById(UUID id) {
            return Optional.ofNullable(store.get(id));
        }
    }
}
