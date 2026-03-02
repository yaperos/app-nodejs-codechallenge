package com.yape.transaction.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Transaction Domain Model Tests")
class TransactionTest {

    @Test
    @DisplayName("Should create transaction with default values")
    void shouldCreateTransactionWithDefaultValues() {
        Transaction transaction = new Transaction();

        assertNotNull(transaction.getTransactionExternalId());
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
        assertNotNull(transaction.getCreatedAt());
        assertNotNull(transaction.getUpdatedAt());
    }

    @Test
    @DisplayName("Should create transaction with constructor parameters")
    void shouldCreateTransactionWithConstructorParameters() {
        UUID debitAccount = UUID.randomUUID();
        UUID creditAccount = UUID.randomUUID();
        Integer transferTypeId = 1;
        BigDecimal value = new BigDecimal("100.00");

        Transaction transaction = new Transaction(debitAccount, creditAccount, transferTypeId, value);

        assertEquals(debitAccount, transaction.getAccountExternalIdDebit());
        assertEquals(creditAccount, transaction.getAccountExternalIdCredit());
        assertEquals(transferTypeId, transaction.getTransferTypeId());
        assertEquals(value, transaction.getValue());
        assertEquals(TransactionStatus.PENDING, transaction.getStatus());
    }

    @Test
    @DisplayName("Should approve transaction")
    void shouldApproveTransaction() {
        Transaction transaction = new Transaction();

        transaction.approve();

        assertEquals(TransactionStatus.APPROVED, transaction.getStatus());
        assertFalse(transaction.isPending());
    }

    @Test
    @DisplayName("Should reject transaction")
    void shouldRejectTransaction() {
        Transaction transaction = new Transaction();

        transaction.reject();

        assertEquals(TransactionStatus.REJECTED, transaction.getStatus());
        assertFalse(transaction.isPending());
    }

    @Test
    @DisplayName("Should identify pending transaction")
    void shouldIdentifyPendingTransaction() {
        Transaction transaction = new Transaction();

        assertTrue(transaction.isPending());
    }
}
