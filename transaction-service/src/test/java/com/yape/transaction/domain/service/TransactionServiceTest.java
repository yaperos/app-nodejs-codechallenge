package com.yape.transaction.domain.service;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.out.TransactionCachePort;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Transaction Service Unit Tests")
class TransactionServiceTest {

    @Mock
    private TransactionRepositoryPort repository;

    @Mock
    private TransactionEventPublisher eventPublisher;

    @Mock
    private TransactionCachePort cache;

    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        transactionService = new TransactionService(repository, eventPublisher, cache);
    }

    @Test
    @DisplayName("Should create transaction with pending status")
    void shouldCreateTransactionWithPendingStatus() {
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        Integer transferTypeId = 1;
        BigDecimal value = new BigDecimal("500.00");

        when(repository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = transactionService.createTransaction(debitAccount, creditAccount, transferTypeId, value);

        assertNotNull(result);
        assertNotNull(result.getTransactionExternalId());
        assertEquals(debitAccount, result.getAccountExternalIdDebit());
        assertEquals(creditAccount, result.getAccountExternalIdCredit());
        assertEquals(transferTypeId, result.getTransferTypeId());
        assertEquals(value, result.getValue());
        assertEquals(TransactionStatus.PENDING, result.getStatus());

        verify(repository).save(any(Transaction.class));
        verify(cache).put(any(Transaction.class));
        verify(eventPublisher).publishTransactionCreated(any(Transaction.class));
    }

    @Test
    @DisplayName("Should get transaction from cache when available")
    void shouldGetTransactionFromCacheWhenAvailable() {
        // Given
        UUID transactionId = UUID.randomUUID();
        Transaction cachedTransaction = new Transaction();
        cachedTransaction.setTransactionExternalId(transactionId);
        cachedTransaction.setStatus(TransactionStatus.APPROVED);

        when(cache.get(transactionId)).thenReturn(Optional.of(cachedTransaction));

        Optional<Transaction> result = transactionService.getTransaction(transactionId);

        assertTrue(result.isPresent());
        assertEquals(transactionId, result.get().getTransactionExternalId());
        assertEquals(TransactionStatus.APPROVED, result.get().getStatus());

        verify(cache).get(transactionId);
        verify(repository, never()).findByExternalId(any());
    }

    @Test
    @DisplayName("Should get transaction from database when not in cache")
    void shouldGetTransactionFromDatabaseWhenNotInCache() {
        UUID transactionId = UUID.randomUUID();
        Transaction dbTransaction = new Transaction();
        dbTransaction.setTransactionExternalId(transactionId);

        when(cache.get(transactionId)).thenReturn(Optional.empty());
        when(repository.findByExternalId(transactionId)).thenReturn(Optional.of(dbTransaction));

        Optional<Transaction> result = transactionService.getTransaction(transactionId);

        assertTrue(result.isPresent());
        verify(cache).get(transactionId);
        verify(repository).findByExternalId(transactionId);
        verify(cache).put(dbTransaction); // Should cache the result
    }

    @Test
    @DisplayName("Should return empty when transaction not found")
    void shouldReturnEmptyWhenTransactionNotFound() {
        UUID transactionId = UUID.randomUUID();

        when(cache.get(transactionId)).thenReturn(Optional.empty());
        when(repository.findByExternalId(transactionId)).thenReturn(Optional.empty());

        Optional<Transaction> result = transactionService.getTransaction(transactionId);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should update transaction status when pending")
    void shouldUpdateTransactionStatusWhenPending() {
        UUID transactionId = UUID.randomUUID();
        Transaction pendingTransaction = new Transaction();
        pendingTransaction.setTransactionExternalId(transactionId);
        pendingTransaction.setStatus(TransactionStatus.PENDING);

        when(repository.findByExternalId(transactionId)).thenReturn(Optional.of(pendingTransaction));
        when(repository.update(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        transactionService.updateStatus(transactionId, TransactionStatus.APPROVED);

        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);
        verify(repository).update(captor.capture());
        assertEquals(TransactionStatus.APPROVED, captor.getValue().getStatus());

        verify(cache).invalidate(transactionId);
        verify(cache).put(any(Transaction.class));
    }

    @Test
    @DisplayName("Should not update transaction status when not pending")
    void shouldNotUpdateTransactionStatusWhenNotPending() {
        UUID transactionId = UUID.randomUUID();
        Transaction approvedTransaction = new Transaction();
        approvedTransaction.setTransactionExternalId(transactionId);
        approvedTransaction.setStatus(TransactionStatus.APPROVED);

        when(repository.findByExternalId(transactionId)).thenReturn(Optional.of(approvedTransaction));

        transactionService.updateStatus(transactionId, TransactionStatus.REJECTED);

        verify(repository, never()).update(any());
        verify(cache, never()).invalidate(any());
    }

    @Test
    @DisplayName("Should not update when transaction not found")
    void shouldNotUpdateWhenTransactionNotFound() {
        UUID transactionId = UUID.randomUUID();

        when(repository.findByExternalId(transactionId)).thenReturn(Optional.empty());

        transactionService.updateStatus(transactionId, TransactionStatus.APPROVED);

        verify(repository, never()).update(any());
    }
}
