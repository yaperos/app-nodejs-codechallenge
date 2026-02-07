package com.yape.codechallenge.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.codechallenge.event.TransactionEvent;
import com.yape.codechallenge.model.Transaction;
import com.yape.codechallenge.repository.TransactionRepository;
import com.yape.codechallenge.request.CreateTransactionRequest;

import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceUnitTest {

    @Mock
    TransactionRepository transactionRepository;

    @Mock
    Emitter<TransactionEvent> transactionEmitter;

    @Mock
    ObjectMapper objectMapper;

    @InjectMocks
    TransactionService transactionService;

    @Test
    public void testCreateTransaction() {
        CreateTransactionRequest request = new CreateTransactionRequest();
        request.accountExternalIdDebit = UUID.randomUUID();
        request.accountExternalIdCredit = UUID.randomUUID();
        request.transferTypeId = 1;
        request.value = new BigDecimal("100");

        Transaction fakeTransaction = new Transaction(
                request.accountExternalIdDebit,
                request.accountExternalIdCredit,
                request.transferTypeId,
                request.value);
        fakeTransaction.transactionExternalId = UUID.randomUUID();
        fakeTransaction.status = "pending";

        when(transactionRepository.save(any())).thenReturn(fakeTransaction);
        when(transactionEmitter.send(any(TransactionEvent.class))).thenReturn(CompletableFuture.completedFuture(null));

        Transaction result = transactionService.createTransaction(request);

        assertNotNull(result);
        assertEquals("pending", result.status);

        verify(transactionRepository).save(any());
        verify(transactionEmitter).send(any(TransactionEvent.class));
    }

}
