package com.yaperos.codechallenge.transaction.application.service;

import com.yaperos.codechallenge.shared.event.TransactionStatusType;
import com.yaperos.codechallenge.transaction.domain.exception.TransactionNotFoundException;
import com.yaperos.codechallenge.transaction.domain.model.Transaction;
import com.yaperos.codechallenge.transaction.domain.model.TransactionStatus;
import com.yaperos.codechallenge.transaction.domain.model.TransferType;
import com.yaperos.codechallenge.transaction.domain.port.output.TransactionEventPublisherPort;
import com.yaperos.codechallenge.transaction.domain.port.output.TransactionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepositoryPort transactionRepository;

    @Mock
    private TransactionEventPublisherPort eventPublisher;

    @InjectMocks
    private TransactionService transactionService;

    private UUID debitId;
    private UUID creditId;

    @BeforeEach
    void setUp() {
        debitId = UUID.randomUUID();
        creditId = UUID.randomUUID();
    }

    @Test
    void create_shouldSaveAndPublishEvent() {
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = transactionService.create(debitId, creditId, TransferType.EXTERNAL, new BigDecimal("500"));

        assertNotNull(result);
        assertEquals(TransactionStatus.PENDING, result.getStatus());
        assertEquals(new BigDecimal("500"), result.getValue());
        verify(transactionRepository).save(any(Transaction.class));
        verify(eventPublisher).publishTransactionCreated(any(Transaction.class));
    }

    @Test
    void getById_shouldReturnTransaction() {
        Transaction transaction = Transaction.create(debitId, creditId, TransferType.EXTERNAL, new BigDecimal("200"));
        when(transactionRepository.findById(transaction.getTransactionExternalId()))
                .thenReturn(Optional.of(transaction));

        Transaction result = transactionService.getById(transaction.getTransactionExternalId());

        assertEquals(transaction.getTransactionExternalId(), result.getTransactionExternalId());
    }

    @Test
    void getById_shouldThrowWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(transactionRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(TransactionNotFoundException.class, () -> transactionService.getById(id));
    }

    @Test
    void updateStatus_shouldApproveTransaction() {
        Transaction transaction = Transaction.create(debitId, creditId, TransferType.EXTERNAL, new BigDecimal("100"));
        when(transactionRepository.findById(transaction.getTransactionExternalId()))
                .thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        transactionService.updateStatus(transaction.getTransactionExternalId(), TransactionStatusType.APPROVED);

        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
        verify(transactionRepository).save(transaction);
    }

    @Test
    void updateStatus_shouldRejectTransaction() {
        Transaction transaction = Transaction.create(debitId, creditId, TransferType.EXTERNAL, new BigDecimal("1500"));
        when(transactionRepository.findById(transaction.getTransactionExternalId()))
                .thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        transactionService.updateStatus(transaction.getTransactionExternalId(), TransactionStatusType.REJECTED);

        assertEquals(TransactionStatus.REJECTED, transaction.getStatus());
        verify(transactionRepository).save(transaction);
    }

}
