package com.yape.transaction_service.service;

import com.yape.shared.TransactionCreatedEvent;
import com.yape.transaction_service.dto.CreateTransactionRequest;
import com.yape.transaction_service.dto.GetTransactionResponse;
import com.yape.transaction_service.entity.Transaction;
import com.yape.transaction_service.entity.TransactionStatus;
import com.yape.transaction_service.producer.TransactionProducer;
import com.yape.transaction_service.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests del TransactionService")
class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @Mock
    private TransactionProducer producer;

    @Captor
    private ArgumentCaptor<Transaction> transactionCaptor;

    @Captor
    private ArgumentCaptor<TransactionCreatedEvent> eventCaptor;

    private TransactionService service;

    @BeforeEach
    void setUp() {
        service = new TransactionService(repository, producer);
    }

    @Test
    @DisplayName("create - Debe crear una transacción correctamente")
    void shouldCreateTransactionSuccessfully() {
        UUID debitId = UUID.randomUUID();
        UUID creditId = UUID.randomUUID();
        CreateTransactionRequest request = new CreateTransactionRequest(
                debitId, creditId, 1, new BigDecimal("500.00")
        );

        UUID expectedTransactionId = UUID.randomUUID();

        Transaction savedTransaction = createTransaction(
                expectedTransactionId,
                debitId,
                creditId,
                1,
                new BigDecimal("500.00"),
                TransactionStatus.PENDING
        );

        when(repository.save(any(Transaction.class))).thenReturn(savedTransaction);

        GetTransactionResponse response = service.create(request);

        assertNotNull(response);

        assertEquals(expectedTransactionId, response.transactionExternalId());

        assertEquals("TRANSFERENCIA", response.transactionType().name());
        assertEquals("pending", response.transactionStatus().name());
        assertEquals(new BigDecimal("500.00"), response.value());

        verify(repository).save(any(Transaction.class));
        verify(producer).sendTransactionCreated(eventCaptor.capture());

        TransactionCreatedEvent event = eventCaptor.getValue();
        assertEquals(expectedTransactionId, event.transactionExternalId());
        assertEquals(new BigDecimal("500.00"), event.value());
    }
    @Test
    @DisplayName("getByExternalId - Debe retornar transacción existente")
    void shouldReturnExistingTransaction() {
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = createTransaction(
                transactionId, UUID.randomUUID(), UUID.randomUUID(),
                1, new BigDecimal("500.00"), TransactionStatus.APPROVED
        );

        when(repository.findByTransactionExternalId(transactionId))
                .thenReturn(Optional.of(transaction));

        GetTransactionResponse response = service.getByExternalId(transactionId);

        assertNotNull(response);
        assertEquals(transactionId, response.transactionExternalId());
        assertEquals("approved", response.transactionStatus().name());
    }

    @Test
    @DisplayName("getByExternalId - Debe lanzar excepción cuando no existe")
    void shouldThrowExceptionWhenNotFound() {
        UUID transactionId = UUID.randomUUID();
        when(repository.findByTransactionExternalId(transactionId))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                service.getByExternalId(transactionId)
        );
    }

    private Transaction createTransaction(UUID id, UUID debitId, UUID creditId,
                                          Integer typeId, BigDecimal value,
                                          TransactionStatus status) {
        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(id);
        transaction.setAccountExternalIdDebit(UUID.fromString(debitId.toString()));
        transaction.setAccountExternalIdCredit(UUID.fromString(creditId.toString()));
        transaction.setTransferTypeId(typeId);
        transaction.setValue(value);
        transaction.setStatus(status);
        transaction.setCreatedAt(LocalDateTime.now());
        return transaction;
    }
}