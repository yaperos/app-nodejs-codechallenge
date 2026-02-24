package com.yape.transaction_service.consumer;

import com.yape.shared.TransactionValidatedEvent;
import com.yape.transaction_service.entity.Transaction;
import com.yape.transaction_service.entity.TransactionStatus;
import com.yape.transaction_service.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests del TransactionConsumer")
class TransactionConsumerTest {

    @Mock
    private TransactionRepository repository;

    @Captor
    private ArgumentCaptor<Transaction> transactionCaptor;

    private TransactionConsumer consumer;

    @BeforeEach
    void setUp() {
        consumer = new TransactionConsumer(repository);
    }

    @Test
    @DisplayName("Debe actualizar transacción a APPROVED")
    void shouldUpdateTransactionToApproved() {
        UUID transactionId = UUID.randomUUID();
        TransactionValidatedEvent event = new TransactionValidatedEvent(transactionId, "APPROVED");

        Transaction existingTransaction = createTransaction(transactionId, TransactionStatus.PENDING);
        when(repository.findByTransactionExternalId(transactionId)).thenReturn(Optional.of(existingTransaction));

        consumer.updateStatus(event);

        verify(repository).save(transactionCaptor.capture());

        Transaction updated = transactionCaptor.getValue();
        assertEquals(TransactionStatus.APPROVED, updated.getStatus());
        assertEquals(transactionId, updated.getTransactionExternalId());
    }

    @Test
    @DisplayName("Debe actualizar transacción a REJECTED")
    void shouldUpdateTransactionToRejected() {
        UUID transactionId = UUID.randomUUID();
        TransactionValidatedEvent event = new TransactionValidatedEvent(transactionId, "REJECTED");

        Transaction existingTransaction = createTransaction(transactionId, TransactionStatus.PENDING);
        when(repository.findByTransactionExternalId(transactionId)).thenReturn(Optional.of(existingTransaction));

        consumer.updateStatus(event);

        verify(repository).save(transactionCaptor.capture());

        Transaction updated = transactionCaptor.getValue();
        assertEquals(TransactionStatus.REJECTED, updated.getStatus());
        assertEquals(transactionId, updated.getTransactionExternalId());
    }

    @Test
    @DisplayName("Debe lanzar excepción cuando la transacción no existe")
    void shouldThrowExceptionWhenTransactionNotFound() {
        UUID transactionId = UUID.randomUUID();
        TransactionValidatedEvent event = new TransactionValidatedEvent(transactionId, "APPROVED");

        when(repository.findByTransactionExternalId(transactionId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> consumer.updateStatus(event));
        verify(repository, never()).save(any());
    }

    private Transaction createTransaction(UUID id, TransactionStatus status) {
        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(id);
        transaction.setAccountExternalIdDebit(UUID.fromString(UUID.randomUUID().toString()));
        transaction.setAccountExternalIdCredit(UUID.fromString(UUID.randomUUID().toString()));
        transaction.setTransferTypeId(1);
        transaction.setValue(new BigDecimal("500.00"));
        transaction.setStatus(status);
        transaction.setCreatedAt(LocalDateTime.now());
        return transaction;
    }
}