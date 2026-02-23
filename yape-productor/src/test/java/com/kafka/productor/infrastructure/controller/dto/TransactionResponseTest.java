package com.kafka.productor.infrastructure.controller.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.model.TransactionStatus;
import com.kafka.productor.domain.model.TransactionType;

public class TransactionResponseTest {
    @Test
    void shouldMapTransactionToResponse() {
        UUID transactionId = UUID.randomUUID();
        UUID accountDebit = UUID.randomUUID();
        UUID accountCredit = UUID.randomUUID();
        TransactionType type = new TransactionType(1L, "TRANSFER");
        Transaction transaction = new Transaction(transactionId, accountDebit, accountCredit, type, 1000.0);
        transaction.setStatus(TransactionStatus.APPROVED);
        transaction.setCreatedAt(LocalDateTime.now());

        TransactionResponse response = TransactionResponse.from(transaction);

        assertNotNull(response);
        assertEquals(transactionId, response.transactionExternalId());
        assertEquals("TRANSFER", response.transactionType().name());
        assertEquals("APPROVED", response.transactionStatus().name());
        assertEquals(1000.0, response.value());
        assertEquals(transaction.getCreatedAt(), response.createdAt());
    }
}
