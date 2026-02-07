package com.yape.codechallenge.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.yape.codechallenge.event.TransactionEvent;

class AntiFraudServiceTest {

    private final AntiFraudService antiFraudService = new AntiFraudService();

    @Test
    void shouldApproveTransactionWhenValueIsLessOrEqualThan1000() {
        UUID transactionId = UUID.randomUUID();
        TransactionEvent event = new TransactionEvent(transactionId, 1000.0, "pending");
        TransactionEvent result = antiFraudService.validateTransaction(event);

        assertNotNull(result);
        assertEquals(transactionId, result.transactionExternalId());
        assertEquals(1000.0, result.value());
        assertEquals("approved", result.status());
    }

    @Test
    void shouldRejectTransactionWhenValueIsGreaterThan1000() {
        UUID transactionId = UUID.randomUUID();
        TransactionEvent event = new TransactionEvent(transactionId, 1000.01, "pending");

        TransactionEvent result = antiFraudService.validateTransaction(event);

        assertNotNull(result);
        assertEquals(transactionId, result.transactionExternalId());
        assertEquals(1000.01, result.value());
        assertEquals("rejected", result.status());
    }
}
