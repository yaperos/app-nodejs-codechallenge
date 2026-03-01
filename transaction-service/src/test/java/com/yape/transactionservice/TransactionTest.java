package com.yape.transactionservice;

import com.yape.transactionservice.domain.enums.TransactionStatus;
import com.yape.transactionservice.domain.exceptions.DomainException;
import com.yape.transactionservice.domain.models.Transaction;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class TransactionTest {

    @Test
    void shouldCreateTransactionWithPendingStatus() {
        Transaction transaction = Transaction.Create(
                UUID.randomUUID(),
                UUID.randomUUID(),
                1,
                new BigDecimal("500")
        );

        assertNotNull(transaction.getTransactionExternalId());
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
        assertEquals(new BigDecimal("500"), transaction.getValue());
        assertNotNull(transaction.getCreatedAt());
    }

    @Test
    void shouldThrowExceptionWhenValueIsZeroOrNegative() {
        assertThrows(DomainException.class, () ->
                Transaction.Create(UUID.randomUUID(), UUID.randomUUID(), 1, BigDecimal.ZERO)
        );

        assertThrows(DomainException.class, () ->
                Transaction.Create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("-100"))
        );
    }

    @Test
    void shouldThrowExceptionWhenDebitIdIsNull() {
        assertThrows(DomainException.class, () ->
                Transaction.Create(null, UUID.randomUUID(), 1, new BigDecimal("500"))
        );
    }

    @Test
    void shouldThrowExceptionWhenDebitIdIsEmpty() {
        assertThrows(DomainException.class, () ->
                Transaction.Create(new UUID(0L, 0L), UUID.randomUUID(), 1, new BigDecimal("500"))
        );
    }

    @Test
    void shouldThrowExceptionWhenCreditIdIsNull() {
        assertThrows(DomainException.class, () ->
                Transaction.Create(UUID.randomUUID(), null, 1, new BigDecimal("500"))
        );
    }

    @Test
    void shouldThrowExceptionWhenTransferTypeIdIsZero() {
        assertThrows(DomainException.class, () ->
                Transaction.Create(UUID.randomUUID(), UUID.randomUUID(), 0, new BigDecimal("500"))
        );
    }

    @Test
    void shouldChangeStatus() {
        Transaction transaction = Transaction.Create(
                UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("500")
        );

        transaction.changeStatus(TransactionStatus.APPROVED);

        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
    }
}
