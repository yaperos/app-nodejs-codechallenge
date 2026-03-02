package com.yape.transaction.application.service;

import com.yape.transaction.domain.model.EventInbound;
import com.yape.transaction.domain.ports.TransactionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UpdateTransactionServiceTest {

    @Mock
    private TransactionRepositoryPort transactionRepositoryPort;

    @InjectMocks
    private UpdateTransactionService updateTransactionService;

    private EventInbound message;

    @BeforeEach
    void setUp() {
        message = new EventInbound();
        message.setTransactionExternalId(UUID.randomUUID().toString());
        message.setValue(new BigDecimal("500.00"));
        message.setStatus("APPROVED");
    }

    @Test
    @DisplayName("should update status successfully when repository completes")
    void execute_shouldUpdateStatus_whenRepositoryCompletes() {
        when(transactionRepositoryPort.updateStatus(message.getTransactionExternalId(), message.getStatus()))
                .thenReturn(Mono.empty());

        StepVerifier.create(updateTransactionService.execute(message))
                .verifyComplete();

        verify(transactionRepositoryPort, times(1))
                .updateStatus(message.getTransactionExternalId(), message.getStatus());
    }

    @Test
    @DisplayName("should complete without error when transaction is not PENDING (no-op from repository)")
    void execute_shouldCompleteWithoutError_whenTransactionIsNotPending() {
        message.setStatus("REJECTED");

        when(transactionRepositoryPort.updateStatus(message.getTransactionExternalId(), message.getStatus()))
                .thenReturn(Mono.empty());

        StepVerifier.create(updateTransactionService.execute(message))
                .verifyComplete();

        verify(transactionRepositoryPort, times(1))
                .updateStatus(message.getTransactionExternalId(), message.getStatus());
    }

    @Test
    @DisplayName("should propagate error when repository fails")
    void execute_shouldPropagateError_whenRepositoryFails() {
        when(transactionRepositoryPort.updateStatus(message.getTransactionExternalId(), message.getStatus()))
                .thenReturn(Mono.error(new RuntimeException("DB connection error")));

        StepVerifier.create(updateTransactionService.execute(message))
                .expectErrorMatches(ex ->
                        ex instanceof RuntimeException &&
                        ex.getMessage().equals("DB connection error"))
                .verify();

        verify(transactionRepositoryPort, times(1))
                .updateStatus(message.getTransactionExternalId(), message.getStatus());
    }
}

