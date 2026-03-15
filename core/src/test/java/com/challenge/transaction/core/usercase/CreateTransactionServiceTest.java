package com.challenge.transaction.core.usercase;

import com.challenge.transaction.core.domain.model.Transaction;
import com.challenge.transaction.core.ports.output.TransactionEventPublisher;
import com.challenge.transaction.core.ports.output.TransactionRepository;
import com.challenge.transaction.core.usecase.CreateTransactionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreateTransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @Mock
    private TransactionEventPublisher publisher;

    @InjectMocks
    private CreateTransactionService service;

    @Test
    void shouldCreateTransactionAndPublishEvent() {

        Transaction transaction = new Transaction();
        transaction.setValue(100.0);

        when(repository.save(any())).thenReturn(transaction);

        Transaction result = service.create(transaction);

        verify(repository).save(any());
        verify(publisher).publishTransactionCreated(any());

        assertNotNull(result);
    }
}
