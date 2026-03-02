package com.yape.infra.adapter.in.kafka;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.yape.application.port.out.TransactionRepositoryPort;
import com.yape.domain.model.Transaction;
import com.yape.domain.model.TransactionStatus;

import reactor.core.publisher.Mono;

class TransactionKafkaConsumerTest {

    @Mock
    private TransactionRepositoryPort transactionRepository;

    @InjectMocks
    private TransactionKafkaConsumer transactionKafkaConsumer;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void consumeTransactionCreated_shouldApproveTransactionWhenValueIsLessThanOrEqualTo1000() {
        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(UUID.randomUUID());
        transaction.setValue(new BigDecimal("500"));

        Transaction existingTransaction = new Transaction();
        existingTransaction.setTransactionExternalId(transaction.getTransactionExternalId());
        existingTransaction.setStatus(TransactionStatus.PENDING);

        when(transactionRepository.findById(transaction.getTransactionExternalId())).thenReturn(Mono.just(existingTransaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(Mono.just(existingTransaction));

        transactionKafkaConsumer.consumeTransactionCreated(transaction);

        verify(transactionRepository, times(1)).findById(transaction.getTransactionExternalId());
        verify(transactionRepository, times(1)).save(argThat(savedTransaction -> savedTransaction.getStatus() == TransactionStatus.APPROVED));
    }

    @Test
    void consumeTransactionCreated_shouldRejectTransactionWhenValueIsGreaterThan1000() {
        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(UUID.randomUUID());
        transaction.setValue(new BigDecimal("1500"));

        Transaction existingTransaction = new Transaction();
        existingTransaction.setTransactionExternalId(transaction.getTransactionExternalId());
        existingTransaction.setStatus(TransactionStatus.PENDING);

        when(transactionRepository.findById(transaction.getTransactionExternalId())).thenReturn(Mono.just(existingTransaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(Mono.just(existingTransaction));

        transactionKafkaConsumer.consumeTransactionCreated(transaction);

        verify(transactionRepository, times(1)).findById(transaction.getTransactionExternalId());
        verify(transactionRepository, times(1)).save(argThat(savedTransaction -> savedTransaction.getStatus() == TransactionStatus.REJECTED));
    }

    @Test
    void consumeTransactionCreated_shouldLogErrorWhenTransactionNotFound() {
        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(UUID.randomUUID());
        transaction.setValue(new BigDecimal("500"));

        when(transactionRepository.findById(transaction.getTransactionExternalId())).thenReturn(Mono.empty());

        transactionKafkaConsumer.consumeTransactionCreated(transaction);

        verify(transactionRepository, times(1)).findById(transaction.getTransactionExternalId());
        verify(transactionRepository, never()).save(any(Transaction.class));
    }
}