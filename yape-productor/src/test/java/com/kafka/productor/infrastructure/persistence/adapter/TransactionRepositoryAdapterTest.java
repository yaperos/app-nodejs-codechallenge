package com.kafka.productor.infrastructure.persistence.adapter;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.infrastructure.mapper.TransactionMapperInterface;
import com.kafka.productor.infrastructure.persistence.entity.TransactionEntity;
import com.kafka.productor.infrastructure.persistence.repository.JpaTransactionRepository;

@ExtendWith(MockitoExtension.class)
class TransactionRepositoryAdapterTest {

    @Mock
    private JpaTransactionRepository repository;

    @Mock
    private TransactionMapperInterface mapper;

    @InjectMocks
    private TransactionRepositoryAdapter adapter;

    @Test
    void shouldSaveTransaction() {

        Transaction transaction = mock(Transaction.class);
        TransactionEntity entity = new TransactionEntity();

        when(mapper.toEntity(transaction)).thenReturn(entity);
        when(repository.save(entity)).thenReturn(entity);

        Transaction result = adapter.save(transaction);

        verify(mapper).toEntity(transaction);
        verify(repository).save(entity);
        assertEquals(transaction, result);
    }

    @Test
    void shouldFindTransactionByExternalId() {

        UUID id = UUID.randomUUID();
        TransactionEntity entity = new TransactionEntity();
        Transaction transaction = mock(Transaction.class);

        when(repository.findByTransactionExternalId(id))
                .thenReturn(Optional.of(entity));

        when(mapper.toDomain(entity)).thenReturn(transaction);

        Optional<Transaction> result = adapter.findByTransactionExternalId(id);

        assertTrue(result.isPresent());
        assertEquals(transaction, result.get());

        verify(repository).findByTransactionExternalId(id);
        verify(mapper).toDomain(entity);
    }

    @Test
    void shouldReturnEmptyWhenTransactionNotFound() {

        UUID id = UUID.randomUUID();

        when(repository.findByTransactionExternalId(id))
                .thenReturn(Optional.empty());

        Optional<Transaction> result = adapter.findByTransactionExternalId(id);

        assertTrue(result.isEmpty());
        verify(repository).findByTransactionExternalId(id);
        verifyNoInteractions(mapper);
    }

    @Test
    void shouldUpdateStatus() {

        UUID id = UUID.randomUUID();
        String newStatus = "APPROVED";

        TransactionEntity entity = new TransactionEntity();

        when(repository.findByTransactionExternalId(id))
                .thenReturn(Optional.of(entity));

        adapter.updateStatus(id, newStatus);

        assertEquals(newStatus, entity.getStatus());
        verify(repository).save(entity);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingStatusAndTransactionNotFound() {

        UUID id = UUID.randomUUID();

        when(repository.findByTransactionExternalId(id))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> adapter.updateStatus(id, "REJECTED")
        );

        verify(repository).findByTransactionExternalId(id);
        verify(repository, never()).save(any());
    }
}