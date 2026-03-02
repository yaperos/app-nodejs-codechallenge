package com.yape.antifraud.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TransactionToValidate Domain Model Tests")
class TransactionToValidateTest {

    @Test
    @DisplayName("Should create transaction to validate with constructor")
    void shouldCreateTransactionToValidateWithConstructor() {
        UUID transactionId = UUID.randomUUID();
        BigDecimal value = new BigDecimal("500.00");

        TransactionToValidate transaction = new TransactionToValidate(transactionId, value);

        assertEquals(transactionId, transaction.getTransactionExternalId());
        assertEquals(value, transaction.getValue());
    }

    @Test
    @DisplayName("Should create empty transaction and set values")
    void shouldCreateEmptyTransactionAndSetValues() {
        TransactionToValidate transaction = new TransactionToValidate();
        UUID transactionId = UUID.randomUUID();
        BigDecimal value = new BigDecimal("1500.00");

        transaction.setTransactionExternalId(transactionId);
        transaction.setValue(value);

        assertEquals(transactionId, transaction.getTransactionExternalId());
        assertEquals(value, transaction.getValue());
    }
}
