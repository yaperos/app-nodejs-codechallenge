package com.kafka.productor.infrastructure.messaging.kafka;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.kafka.productor.domain.model.Transaction;

class TransactionCreatedEventTest {

    @Test
    void shouldCreateEventFromTransaction() {

        UUID id = UUID.randomUUID();
        double value = 150.0;

        Transaction transaction = mock(Transaction.class);
        when(transaction.getTransactionExternalId()).thenReturn(id);
        when(transaction.getValue()).thenReturn(value);

        TransactionCreatedEvent event =
                TransactionCreatedEvent.from(transaction);

        assertEquals(id, event.transactionExternalId());
        assertEquals(value, event.value());
    }
}