package com.kafka.productor.infrastructure.controller.dto;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

class CreateTransactionResponseTest {

    @Test
    void shouldCreateResponseWithTransactionId() {
        UUID transactionId = UUID.randomUUID();

        CreateTransactionResponse response = new CreateTransactionResponse(transactionId);

        assertNotNull(response);
        assertEquals(transactionId, response.transactionExternalId());
    }

    @Test
    void shouldHandleNullTransactionId() {
        CreateTransactionResponse response = new CreateTransactionResponse(null);

        assertNotNull(response);
        assertNull(response.transactionExternalId());
    }
}