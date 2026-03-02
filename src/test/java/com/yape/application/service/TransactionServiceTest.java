package com.yape.application.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.yape.application.port.out.TransactionEventPublishPort;
import com.yape.application.port.out.TransactionRepositoryPort;
import com.yape.domain.exception.NotFoundException;
import com.yape.domain.model.Transaction;
import com.yape.domain.model.TransactionStatus;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

class TransactionServiceTest {

    @Mock
    private TransactionRepositoryPort transactionRepository;

    @Mock
    private TransactionEventPublishPort transactionEventPublisher;

    @InjectMocks
    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTransaction_shouldSaveTransactionAndPublishEvent() {
        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(UUID.randomUUID());
        transaction.setStatus(TransactionStatus.PENDING);

        when(transactionRepository.save(any(Transaction.class))).thenReturn(Mono.just(transaction));
        when(transactionEventPublisher.publishTransactionCreated(any(Transaction.class))).thenReturn(Mono.empty());

        Mono<Transaction> result = transactionService.createTransaction(transaction);

        StepVerifier.create(result)
                .expectNextMatches(savedTransaction -> savedTransaction.getStatus() == TransactionStatus.PENDING)
                .verifyComplete();

        verify(transactionRepository, times(1)).save(transaction);
        verify(transactionEventPublisher, times(1)).publishTransactionCreated(transaction);
    }

    @Test
    void getTransaction_shouldReturnTransactionWhenFound() {
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(transactionId);

        when(transactionRepository.findById(transactionId)).thenReturn(Mono.just(transaction));
        Mono<Transaction> result = transactionService.getTransaction(transactionId);
        StepVerifier.create(result)
                .expectNext(transaction)
                .verifyComplete();

        verify(transactionRepository, times(1)).findById(transactionId);
    }

    @Test
    void getTransaction_shouldThrowNotFoundExceptionWhenNotFound() {
        UUID transactionId = UUID.randomUUID();

        when(transactionRepository.findById(transactionId)).thenReturn(Mono.empty());

        Mono<Transaction> result = transactionService.getTransaction(transactionId);

        StepVerifier.create(result)
                .expectErrorMatches(throwable -> throwable instanceof NotFoundException &&
                        throwable.getMessage().equals("Transaction not found with id: " + transactionId))
                .verify();

        verify(transactionRepository, times(1)).findById(transactionId);
    }
}