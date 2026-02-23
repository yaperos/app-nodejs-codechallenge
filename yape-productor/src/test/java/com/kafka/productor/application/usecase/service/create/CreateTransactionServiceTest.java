package com.kafka.productor.application.usecase.service.create;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.kafka.productor.application.usecase.command.CreateTransactionCommand;
import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.port.EventPublisherPort;
import com.kafka.productor.domain.port.TransactionRepositoryPort;

class CreateTransactionServiceTest {

    private TransactionRepositoryPort repository;
    private EventPublisherPort eventPublisher;
    private CreateTransactionService service;

    @BeforeEach
    void setup() {
        repository = mock(TransactionRepositoryPort.class);
        eventPublisher = mock(EventPublisherPort.class);
        service = new CreateTransactionService(repository, eventPublisher);
    }

    @Test
    void execute_shouldCreateTransactionAndPublishEvent() {
        CreateTransactionCommand command = new CreateTransactionCommand(
                UUID.randomUUID(), UUID.randomUUID(), 1L, 1000.0
        );

        UUID externalId = service.execute(command);

        assertNotNull(externalId);

        ArgumentCaptor<Transaction> transactionCaptor = ArgumentCaptor.forClass(Transaction.class);
        verify(repository).save(transactionCaptor.capture());
        Transaction saved = transactionCaptor.getValue();

        assertEquals(externalId, saved.getTransactionExternalId());
        assertEquals(command.accountExternalIdDebit(), saved.getAccountExternalIdDebit());
        assertEquals(command.accountExternalIdCredit(), saved.getAccountExternalIdCredit());
        assertEquals(command.transferTypeId(), saved.getTransactionType().getId());
        assertEquals(command.value(), saved.getValue());

        verify(eventPublisher).publishTransactionCreated(saved);
    }
}