package com.kafka.productor.application.usecase.service.get;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.model.TransactionType;
import com.kafka.productor.domain.port.TransactionCachePort;
import com.kafka.productor.domain.port.TransactionRepositoryPort;

class GetTransactionServiceTest {

    private TransactionRepositoryPort repository;
    private TransactionCachePort cache;
    private GetTransactionService service;

    @BeforeEach
    void setup() {
        repository = mock(TransactionRepositoryPort.class);
        cache = mock(TransactionCachePort.class);
        service = new GetTransactionService(repository, cache);
    }

    @Test
    void execute_shouldReturnFromCache_ifPresent() {
        UUID id = UUID.randomUUID();
        Transaction transaction = new Transaction(id, UUID.randomUUID(), UUID.randomUUID(),
                new TransactionType(1L, "TRANSFER"), 100.0);

        when(cache.findById(id)).thenReturn(Optional.of(transaction));

        Optional<Transaction> result = service.execute(id);

        assertTrue(result.isPresent());
        assertEquals(transaction, result.get());

        verify(repository, never()).findByTransactionExternalId(any());
    }

    @Test
    void execute_shouldReturnFromRepository_ifCacheEmpty() {
        UUID id = UUID.randomUUID();
        Transaction transaction = new Transaction(id, UUID.randomUUID(), UUID.randomUUID(),
                new TransactionType(1L, "TRANSFER"), 200.0);

        when(cache.findById(id)).thenReturn(Optional.empty());
        when(repository.findByTransactionExternalId(id)).thenReturn(Optional.of(transaction));

        Optional<Transaction> result = service.execute(id);

        assertTrue(result.isPresent());
        assertEquals(transaction, result.get());

        verify(cache).save(transaction);
    }

    @Test
    void execute_shouldReturnEmpty_ifNotFoundAnywhere() {
        UUID id = UUID.randomUUID();

        when(cache.findById(id)).thenReturn(Optional.empty());
        when(repository.findByTransactionExternalId(id)).thenReturn(Optional.empty());

        Optional<Transaction> result = service.execute(id);

        assertTrue(result.isEmpty());
        verify(cache, never()).save(any());
    }
}