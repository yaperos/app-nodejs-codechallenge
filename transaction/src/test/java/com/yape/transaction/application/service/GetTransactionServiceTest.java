package com.yape.transaction.application.service;

import com.yape.transaction.application.dto.GetTransactionResponse;
import com.yape.transaction.domain.entities.Transaction;
import com.yape.transaction.domain.enums.TransactionStatus;
import com.yape.transaction.domain.ports.TransactionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetTransactionServiceTest {

    @Mock
    private TransactionRepositoryPort transactionRepositoryPort;

    @InjectMocks
    private GetTransactionService getTransactionService;

    private String transactionExternalId;
    private Transaction transaction;

    @BeforeEach
    void setUp() {
        transactionExternalId = UUID.randomUUID().toString();

        transaction = Transaction.builder()
                .id(1L)
                .transactionExternalId(transactionExternalId)
                .accountExternalIdDebit(UUID.randomUUID().toString())
                .accountExternalIdCredit(UUID.randomUUID().toString())
                .type("DEPOSIT")
                .status(TransactionStatus.PENDING.getValue())
                .value(new BigDecimal("500.00"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .version(0L)
                .build();
    }

    @Test
    @DisplayName("should return transaction when it exists")
    void execute_shouldReturnTransaction_whenExists() {
        when(transactionRepositoryPort.findById(transactionExternalId)).thenReturn(Mono.just(transaction));

        StepVerifier.create(getTransactionService.execute(transactionExternalId))
                .assertNext(response -> {
                    assertThat(response).isNotNull();
                    assertThat(response.getTransactionExternalId()).isEqualTo(transactionExternalId);
                    assertThat(response.getValue()).isEqualTo(transaction.getValue());
                    assertThat(response.getTransactionStatus().getName()).isEqualTo(TransactionStatus.PENDING.getValue());
                    assertThat(response.getTransactionType().getName()).isEqualTo("DEPOSIT");
                    assertThat(response.getCreatedAt()).isEqualTo(transaction.getCreatedAt());
                })
                .verifyComplete();

        verify(transactionRepositoryPort, times(1)).findById(transactionExternalId);
    }

    @Test
    @DisplayName("should throw 404 NOT_FOUND when transaction does not exist")
    void execute_shouldThrowNotFound_whenTransactionDoesNotExist() {
        when(transactionRepositoryPort.findById(transactionExternalId)).thenReturn(Mono.empty());

        StepVerifier.create(getTransactionService.execute(transactionExternalId))
                .expectErrorMatches(ex ->
                        ex instanceof ResponseStatusException &&
                        ((ResponseStatusException) ex).getStatusCode().value() == 404 &&
                        ex.getMessage().contains(transactionExternalId))
                .verify();

        verify(transactionRepositoryPort, times(1)).findById(transactionExternalId);
    }

    @Test
    @DisplayName("should propagate error when repository fails")
    void execute_shouldPropagateError_whenRepositoryFails() {
        when(transactionRepositoryPort.findById(transactionExternalId))
                .thenReturn(Mono.error(new RuntimeException("DB connection error")));

        StepVerifier.create(getTransactionService.execute(transactionExternalId))
                .expectErrorMatches(ex ->
                        ex instanceof RuntimeException &&
                        ex.getMessage().equals("DB connection error"))
                .verify();

        verify(transactionRepositoryPort, times(1)).findById(transactionExternalId);
    }
}

