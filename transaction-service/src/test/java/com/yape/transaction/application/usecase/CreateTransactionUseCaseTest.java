package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("CreateTransactionUseCase Unit Tests")
class CreateTransactionUseCaseTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionEventPublisher transactionEventPublisher;

    @InjectMocks
    private CreateTransactionUseCaseImpl createTransactionUseCase;

    @Captor
    private ArgumentCaptor<Transaction> transactionCaptor;

    private Transaction inputTransaction;

    @BeforeEach
    void setUp() {
        inputTransaction = Transaction.builder()
                .accountDebit(UUID.randomUUID())
                .accountCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();
    }

    @Test
    @DisplayName("Should set PENDING status on new transaction")
    void shouldSetPendingStatusOnNewTransaction() {
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = createTransactionUseCase.create(inputTransaction);

        assertEquals(TransactionStatus.PENDING, result.getStatus());
    }

    @Test
    @DisplayName("Should generate UUID as external ID")
    void shouldGenerateUuidAsExternalId() {
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = createTransactionUseCase.create(inputTransaction);

        assertNotNull(result.getExternalId());
    }

    @Test
    @DisplayName("Should set createdAt timestamp")
    void shouldSetCreatedAtTimestamp() {
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = createTransactionUseCase.create(inputTransaction);

        assertNotNull(result.getCreatedAt());
    }

    @Test
    @DisplayName("Should save transaction to repository")
    void shouldSaveTransactionToRepository() {
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        createTransactionUseCase.create(inputTransaction);

        verify(transactionRepository).save(transactionCaptor.capture());
        Transaction savedTransaction = transactionCaptor.getValue();
        assertEquals(TransactionStatus.PENDING, savedTransaction.getStatus());
        assertNotNull(savedTransaction.getExternalId());
        assertEquals(new BigDecimal("500.00"), savedTransaction.getValue());
    }

    @Test
    @DisplayName("Should publish transaction created event after saving")
    void shouldPublishTransactionCreatedEventAfterSaving() {
        Transaction savedTransaction = Transaction.builder()
                .id(1L)
                .externalId(UUID.randomUUID())
                .accountDebit(inputTransaction.getAccountDebit())
                .accountCredit(inputTransaction.getAccountCredit())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .status(TransactionStatus.PENDING)
                .build();

        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        createTransactionUseCase.create(inputTransaction);

        verify(transactionEventPublisher).publishTransactionCreated(savedTransaction);
    }

    @Test
    @DisplayName("Should return the saved transaction")
    void shouldReturnTheSavedTransaction() {
        Transaction savedTransaction = Transaction.builder()
                .id(1L)
                .externalId(UUID.randomUUID())
                .accountDebit(inputTransaction.getAccountDebit())
                .accountCredit(inputTransaction.getAccountCredit())
                .transferTypeId(1)
                .value(new BigDecimal("500.00"))
                .status(TransactionStatus.PENDING)
                .build();

        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        Transaction result = createTransactionUseCase.create(inputTransaction);

        assertEquals(savedTransaction.getId(), result.getId());
        assertEquals(savedTransaction.getExternalId(), result.getExternalId());
        assertEquals(savedTransaction.getValue(), result.getValue());
    }

    @Test
    @DisplayName("Should preserve original account and transfer details")
    void shouldPreserveOriginalAccountAndTransferDetails() {
        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = createTransactionUseCase.create(inputTransaction);

        assertEquals(inputTransaction.getAccountDebit(), result.getAccountDebit());
        assertEquals(inputTransaction.getAccountCredit(), result.getAccountCredit());
        assertEquals(inputTransaction.getTransferTypeId(), result.getTransferTypeId());
        assertEquals(inputTransaction.getValue(), result.getValue());
    }
}
