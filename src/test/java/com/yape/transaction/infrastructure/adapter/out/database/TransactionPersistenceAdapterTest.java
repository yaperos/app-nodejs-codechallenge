package com.yape.transaction.infrastructure.adapter.out.database;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.infrastructure.adapter.out.database.entity.TransactionEntity;
import com.yape.transaction.infrastructure.adapter.out.database.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TransactionPersistenceAdapterTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionPersistenceAdapter transactionPersistenceAdapter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void save_ShouldReturnSavedTransaction() {
        // Arrange
        Transaction transaction = Transaction.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500"))
                .status(TransactionStatus.PENDING)
                .build();

        TransactionEntity savedEntity = TransactionEntity.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .transferTypeId(transaction.getTransferTypeId())
                .value(transaction.getValue())
                .status(transaction.getStatus())
                .createdAt(LocalDateTime.now())
                .build();

        when(transactionRepository.save(any(TransactionEntity.class))).thenReturn(savedEntity);

        // Act
        Transaction result = transactionPersistenceAdapter.save(transaction);

        // Assert
        assertNotNull(result);
        assertEquals(savedEntity.getTransactionExternalId(), result.getTransactionExternalId());
        assertEquals(savedEntity.getStatus(), result.getStatus());
        verify(transactionRepository, times(1)).save(any(TransactionEntity.class));
    }

    @Test
    void findById_ShouldReturnTransaction_WhenExists() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        TransactionEntity entity = TransactionEntity.builder()
                .transactionExternalId(transactionId)
                .value(new BigDecimal("100"))
                .status(TransactionStatus.APPROVED)
                .build();

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(entity));

        // Act
        Optional<Transaction> result = transactionPersistenceAdapter.findById(transactionId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(transactionId, result.get().getTransactionExternalId());
        verify(transactionRepository, times(1)).findById(transactionId);
    }

    @Test
    void findById_ShouldReturnEmpty_WhenNotExists() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        when(transactionRepository.findById(transactionId)).thenReturn(Optional.empty());

        // Act
        Optional<Transaction> result = transactionPersistenceAdapter.findById(transactionId);

        // Assert
        assertFalse(result.isPresent());
        verify(transactionRepository, times(1)).findById(transactionId);
    }
}
