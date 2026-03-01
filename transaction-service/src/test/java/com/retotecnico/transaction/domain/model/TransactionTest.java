package com.retotecnico.transaction.domain.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class TransactionTest {

    @Test
    void shouldCreateTransactionWithPendingStatus() {
        Transaction tx = Transaction.create(
                UUID.randomUUID(),
                UUID.randomUUID(),
                1,
                new BigDecimal("500")
        );

        assertNotNull(tx.getTransactionExternalId());
        assertEquals(TransactionStatus.PENDING, tx.getStatus());
        assertEquals(TransferType.TRANSFER, tx.getTransferType());
        assertNotNull(tx.getCreatedAt());
    }

    @Test
    void shouldApproveTransaction() {
        Transaction tx = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        tx.approve();
        assertEquals(TransactionStatus.APPROVED, tx.getStatus());
    }

    @Test
    void shouldRejectTransaction() {
        Transaction tx = Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        tx.reject();
        assertEquals(TransactionStatus.REJECTED, tx.getStatus());
    }

    @Test
    void shouldThrowExceptionForInvalidTransferType() {
        assertThrows(IllegalArgumentException.class, () ->
                Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 99, new BigDecimal("100"))
        );
    }
}
