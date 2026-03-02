package com.yape.transaction.infraestructure.adapter.persistence;

import com.yape.transaction.domain.entities.Transaction;
import com.yape.transaction.domain.enums.TransactionStatus;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionRepositoryImplTest {

    @Mock
    private TransactionR2dbcRepository transactionR2dbcRepository;

    @InjectMocks
    private TransactionRepositoryImpl transactionRepositoryImpl;

    private String transactionExternalId;
    private Transaction pendingTransaction;
    private Transaction approvedTransaction;

    @BeforeEach
    void setUp() {
        transactionExternalId = UUID.randomUUID().toString();

        pendingTransaction = Transaction.builder()
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

        approvedTransaction = Transaction.builder()
                .id(2L)
                .transactionExternalId(transactionExternalId)
                .accountExternalIdDebit(UUID.randomUUID().toString())
                .accountExternalIdCredit(UUID.randomUUID().toString())
                .type("DEPOSIT")
                .status("APPROVED")
                .value(new BigDecimal("500.00"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .version(1L)
                .build();
    }

    @Test
    @DisplayName("findById - should return transaction when it exists")
    void findById_shouldReturnTransaction_whenExists() {
        when(transactionR2dbcRepository.findByTransactionExternalId(transactionExternalId))
                .thenReturn(Mono.just(pendingTransaction));

        StepVerifier.create(transactionRepositoryImpl.findById(transactionExternalId))
                .assertNext(t -> assertThat(t.getTransactionExternalId()).isEqualTo(transactionExternalId))
                .verifyComplete();

        verify(transactionR2dbcRepository, times(1)).findByTransactionExternalId(transactionExternalId);
    }

    @Test
    @DisplayName("findById - should return empty when transaction does not exist")
    void findById_shouldReturnEmpty_whenNotExists() {
        when(transactionR2dbcRepository.findByTransactionExternalId(transactionExternalId))
                .thenReturn(Mono.empty());

        StepVerifier.create(transactionRepositoryImpl.findById(transactionExternalId))
                .verifyComplete();

        verify(transactionR2dbcRepository, times(1)).findByTransactionExternalId(transactionExternalId);
    }


    @Test
    @DisplayName("save - should save transaction successfully")
    void save_shouldSaveTransaction_successfully() {
        when(transactionR2dbcRepository.save(pendingTransaction)).thenReturn(Mono.just(pendingTransaction));

        StepVerifier.create(transactionRepositoryImpl.save(pendingTransaction))
                .assertNext(t -> assertThat(t.getTransactionExternalId()).isEqualTo(transactionExternalId))
                .verifyComplete();

        verify(transactionR2dbcRepository, times(1)).save(pendingTransaction);
    }

    @Test
    @DisplayName("save - should throw 409 CONFLICT when unique index violation occurs")
    void save_shouldThrowConflict_whenUniqueIndexViolation() {
        when(transactionR2dbcRepository.save(pendingTransaction))
                .thenReturn(Mono.error(new RuntimeException("idx_debit_credit_type_pending")));

        StepVerifier.create(transactionRepositoryImpl.save(pendingTransaction))
                .expectErrorMatches(ex ->
                        ex instanceof ResponseStatusException &&
                        ((ResponseStatusException) ex).getStatusCode().value() == 409)
                .verify();
    }


    @Test
    @DisplayName("save - should propagate error when repository fails with non-retriable error")
    void save_shouldPropagateError_whenNonRetriableError() {
        when(transactionR2dbcRepository.save(pendingTransaction))
                .thenReturn(Mono.error(new RuntimeException("Unexpected DB error")));

        StepVerifier.create(transactionRepositoryImpl.save(pendingTransaction))
                .expectErrorMatches(ex -> ex instanceof RuntimeException)
                .verify();
    }


    @Test
    @DisplayName("updateStatus - should update status when transaction is PENDING")
    void updateStatus_shouldUpdate_whenTransactionIsPending() {
        Transaction updatedTransaction = Transaction.builder()
                .id(pendingTransaction.getId())
                .transactionExternalId(transactionExternalId)
                .accountExternalIdDebit(pendingTransaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(pendingTransaction.getAccountExternalIdCredit())
                .type(pendingTransaction.getType())
                .status("APPROVED")
                .value(pendingTransaction.getValue())
                .createdAt(pendingTransaction.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .version(1L)
                .build();

        when(transactionR2dbcRepository.findByTransactionExternalId(transactionExternalId))
                .thenReturn(Mono.just(pendingTransaction));
        when(transactionR2dbcRepository.save(any(Transaction.class))).thenReturn(Mono.just(updatedTransaction));

        StepVerifier.create(transactionRepositoryImpl.updateStatus(transactionExternalId, "APPROVED"))
                .verifyComplete();

        verify(transactionR2dbcRepository, times(1)).findByTransactionExternalId(transactionExternalId);
        verify(transactionR2dbcRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("updateStatus - should do nothing when transaction is not PENDING")
    void updateStatus_shouldDoNothing_whenTransactionIsNotPending() {
        when(transactionR2dbcRepository.findByTransactionExternalId(transactionExternalId))
                .thenReturn(Mono.just(approvedTransaction));

        StepVerifier.create(transactionRepositoryImpl.updateStatus(transactionExternalId, "REJECTED"))
                .verifyComplete();

        verify(transactionR2dbcRepository, times(1)).findByTransactionExternalId(transactionExternalId);
        verify(transactionR2dbcRepository, never()).save(any(Transaction.class));
    }

    @Test
    @DisplayName("updateStatus - should complete when transaction does not exist")
    void updateStatus_shouldComplete_whenTransactionNotFound() {
        when(transactionR2dbcRepository.findByTransactionExternalId(transactionExternalId))
                .thenReturn(Mono.empty());

        StepVerifier.create(transactionRepositoryImpl.updateStatus(transactionExternalId, "APPROVED"))
                .verifyComplete();

        verify(transactionR2dbcRepository, times(1)).findByTransactionExternalId(transactionExternalId);
        verify(transactionR2dbcRepository, never()).save(any(Transaction.class));
    }


    @Test
    @DisplayName("updateStatus - should propagate error when repository save fails")
    void updateStatus_shouldPropagateError_whenSaveFails() {
        when(transactionR2dbcRepository.findByTransactionExternalId(transactionExternalId))
                .thenReturn(Mono.just(pendingTransaction));
        when(transactionR2dbcRepository.save(any(Transaction.class)))
                .thenReturn(Mono.error(new RuntimeException("DB connection error")));

        StepVerifier.create(transactionRepositoryImpl.updateStatus(transactionExternalId, "APPROVED"))
                .expectErrorMatches(ex ->
                        ex instanceof RuntimeException &&
                        ex.getMessage().equals("DB connection error"))
                .verify();
    }
}

