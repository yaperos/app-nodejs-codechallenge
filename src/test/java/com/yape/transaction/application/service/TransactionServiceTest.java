package com.yape.transaction.application.service;

import com.yape.transaction.application.port.out.TransactionEventPublisherPort;
import com.yape.transaction.application.port.out.TransactionRepositoryPort;
import com.yape.transaction.domain.exception.TransactionNotFoundException;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TransactionServiceTest {

    @Mock
    private TransactionRepositoryPort transactionRepository;

    @Mock
    private TransactionEventPublisherPort transactionEventPublisher;

    @InjectMocks
    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTransaction_ShouldSaveAndPublishEvent() {
        // Arrange
        Transaction transaction = Transaction.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500"))
                .build();

        Transaction savedTransaction = Transaction.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .transferTypeId(transaction.getTransferTypeId())
                .value(transaction.getValue())
                .status(TransactionStatus.PENDING)
                .build();

        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        // Act
        Transaction result = transactionService.createTransaction(transaction);

        // Assert
        assertNotNull(result);
        assertEquals(TransactionStatus.PENDING, result.getStatus());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(transactionEventPublisher, times(1)).publishTransactionCreated(savedTransaction);
    }

    @Test
    void getTransaction_ShouldReturnTransaction_WhenExists() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = Transaction.builder()
                .transactionExternalId(transactionId)
                .value(new BigDecimal("100"))
                .status(TransactionStatus.APPROVED)
                .build();

        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(transaction));

        // Act
        Transaction result = transactionService.getTransaction(transactionId);

        // Assert
        assertNotNull(result);
        assertEquals(transactionId, result.getTransactionExternalId());
        verify(transactionRepository, times(1)).findById(transactionId);
    }

    @Test
    void getTransaction_ShouldThrowException_WhenNotExists() {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        when(transactionRepository.findById(transactionId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(TransactionNotFoundException.class, () -> transactionService.getTransaction(transactionId));
        verify(transactionRepository, times(1)).findById(transactionId);
    }
}
