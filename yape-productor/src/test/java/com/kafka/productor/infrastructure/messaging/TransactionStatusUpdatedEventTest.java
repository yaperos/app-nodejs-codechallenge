package com.kafka.productor.infrastructure.messaging;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.kafka.productor.infrastructure.messaging.event.TransactionStatusUpdatedEvent;

class TransactionStatusUpdatedEventTest {

    @Test
    void shouldCreateRecordCorrectly() {

        UUID id = UUID.randomUUID();
        String status = "COMPLETED";

        TransactionStatusUpdatedEvent event =
                new TransactionStatusUpdatedEvent(id, status);

        assertEquals(id, event.transactionExternalId());
        assertEquals(status, event.status());
    }
}