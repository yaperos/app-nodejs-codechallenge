package com.yaperos.codechallenge.transaction.domain.model;

import com.yaperos.codechallenge.transaction.domain.exception.InvalidTransferTypeException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class TransactionTest {

    @Test
    void create_shouldInitializeWithPendingStatus() {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(),
                UUID.randomUUID(),
                TransferType.EXTERNAL,
                new BigDecimal("500")
        );

        assertNotNull(transaction.getTransactionExternalId());
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
        assertEquals(new BigDecimal("500"), transaction.getValue());
        assertEquals(TransferType.EXTERNAL, transaction.getTransferType());
        assertNotNull(transaction.getCreatedAt());
    }

    @Test
    void approve_shouldChangeStatusToApproved() {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(), UUID.randomUUID(), TransferType.EXTERNAL, new BigDecimal("100"));

        transaction.approve();

        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
    }

    @Test
    void reject_shouldChangeStatusToRejected() {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(), UUID.randomUUID(), TransferType.EXTERNAL, new BigDecimal("2000"));

        transaction.reject();

        assertEquals(TransactionStatus.REJECTED, transaction.getStatus());
    }

    @Test
    void approve_shouldBeIdempotentWhenAlreadyApproved() {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(), UUID.randomUUID(), TransferType.EXTERNAL, new BigDecimal("100"));
        transaction.approve();

        assertDoesNotThrow(transaction::approve);
        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
    }

    @Test
    void reject_shouldBeIdempotentWhenAlreadyRejected() {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(), UUID.randomUUID(), TransferType.EXTERNAL, new BigDecimal("2000"));
        transaction.reject();

        assertDoesNotThrow(transaction::reject);
        assertEquals(TransactionStatus.REJECTED, transaction.getStatus());
    }

    @Test
    void approve_shouldThrowWhenAlreadyRejected() {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(), UUID.randomUUID(), TransferType.EXTERNAL, new BigDecimal("2000"));
        transaction.reject();

        assertThrows(IllegalStateException.class, transaction::approve);
    }

    @Test
    void reject_shouldThrowWhenAlreadyApproved() {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(), UUID.randomUUID(), TransferType.EXTERNAL, new BigDecimal("100"));
        transaction.approve();

        assertThrows(IllegalStateException.class, transaction::reject);
    }

    @Test
    void transferType_fromId_shouldReturnCorrectType() {
        assertEquals(TransferType.EXTERNAL, TransferType.fromId(1));
    }

    @Test
    void transferType_fromId_shouldThrowForUnknownId() {
        assertThrows(InvalidTransferTypeException.class, () -> TransferType.fromId(999));
    }

}
