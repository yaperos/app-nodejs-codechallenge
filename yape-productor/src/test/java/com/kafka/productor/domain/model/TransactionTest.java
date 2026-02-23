package com.kafka.productor.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class TransactionTest {

    @Test
    void testDefaultConstructor() {
        Transaction tx = new Transaction();
        assertNull(tx.getTransactionExternalId());
        assertNull(tx.getAccountExternalIdDebit());
        assertNull(tx.getAccountExternalIdCredit());
        assertNull(tx.getTransactionType());
        assertNull(tx.getStatus());
        assertEquals(0.0, tx.getValue());
        assertNull(tx.getCreatedAt());
    }

    @Test
    void testConstructorWithIdAndValue() {
        UUID id = UUID.randomUUID();
        double value = 123.45;
        Transaction tx = new Transaction(id, value);

        assertEquals(id, tx.getTransactionExternalId());
        assertEquals(value, tx.getValue());
        assertNull(tx.getAccountExternalIdDebit());
        assertNull(tx.getAccountExternalIdCredit());
        assertNull(tx.getTransactionType());
        assertNull(tx.getStatus());
        assertNull(tx.getCreatedAt());
    }

    @Test
    void testFullConstructor() {
        UUID idDebit = UUID.randomUUID();
        UUID idCredit = UUID.randomUUID();
        UUID transactionId = UUID.randomUUID();
        double value = 500.0;
        TransactionType type = new TransactionType(1L, "TRANSFER");

        Transaction tx = new Transaction(transactionId, idDebit, idCredit, type, value);

        assertEquals(transactionId, tx.getTransactionExternalId());
        assertEquals(idDebit, tx.getAccountExternalIdDebit());
        assertEquals(idCredit, tx.getAccountExternalIdCredit());
        assertEquals(type, tx.getTransactionType());
        assertEquals(TransactionStatus.PENDING, tx.getStatus());
        assertEquals(value, tx.getValue());
        assertNotNull(tx.getCreatedAt());
        assertTrue(tx.getCreatedAt().isBefore(LocalDateTime.now().plusSeconds(1)));
    }

    @Test
    void testApproveRejectUpdateStatus() {
        Transaction tx = new Transaction(UUID.randomUUID(), 100.0);
        tx.approve();
        assertEquals(TransactionStatus.APPROVED, tx.getStatus());

        tx.reject();
        assertEquals(TransactionStatus.REJECTED, tx.getStatus());

        tx.updateStatus(TransactionStatus.PENDING);
        assertEquals(TransactionStatus.PENDING, tx.getStatus());
    }

    @Test
    void testTransactionTypeGettersSetters() {
        TransactionType type = new TransactionType();
        type.setId(10L);
        type.setName("TRANSFER");

        assertEquals(10L, type.getId());
        assertEquals("TRANSFER", type.getName());

        TransactionType type2 = new TransactionType(20L, "DEPOSIT");
        assertEquals(20L, type2.getId());
        assertEquals("DEPOSIT", type2.getName());
    }
}