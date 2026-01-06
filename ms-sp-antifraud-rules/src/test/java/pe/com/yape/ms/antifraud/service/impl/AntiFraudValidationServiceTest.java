package pe.com.yape.ms.antifraud.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import pe.com.yape.ms.antifraud.model.domain.Transaction;
import pe.com.yape.ms.antifraud.model.domain.TransactionValidation;
import pe.com.yape.ms.antifraud.model.domain.ValidationStatus;

/**
 * Test unitario para AntiFraudValidationService validando regla: Monto > 1000 = REJECTED
 * @author lmarusic
 */
@DisplayName("AntiFraud Validation Service Tests")
class AntiFraudValidationServiceTest {

    private AntiFraudValidationServiceImpl validationService;

    @BeforeEach
    void setUp() {
        validationService = new AntiFraudValidationServiceImpl();
    }

    @Test
    @DisplayName("Should APPROVE transaction when amount is LESS than 1000")
    void shouldApproveTransactionWhenAmountIsLessThan1000() {
        // Given
        Transaction transaction = new Transaction(
            "txn-001",
            "account-debit-001",
            "account-credit-001",
            500.0,
            1,
            "PENDING",
            "c",
            null
        );

        // When
        TransactionValidation result = validationService.validate(transaction);

        // Then
        assertNotNull(result);
        assertEquals("txn-001", result.transactionId());
        assertEquals(ValidationStatus.APPROVED, result.status());
        assertEquals(500.0, result.amount());
        assertTrue(result.isApproved());
        assertFalse(result.isRejected());
        assertEquals("Transaction amount is within acceptable limits", result.reason());
    }

    @Test
    @DisplayName("Should APPROVE transaction when amount is EXACTLY 1000")
    void shouldApproveTransactionWhenAmountIsExactly1000() {
        // Given
        Transaction transaction = new Transaction(
            "txn-002",
            "account-debit-002",
            "account-credit-002",
            1000.0,
            1,
            "PENDING",
            "c",
            null
        );

        // When
        TransactionValidation result = validationService.validate(transaction);

        // Then
        assertNotNull(result);
        assertEquals("txn-002", result.transactionId());
        assertEquals(ValidationStatus.APPROVED, result.status());
        assertEquals(1000.0, result.amount());
        assertTrue(result.isApproved());
    }

    @Test
    @DisplayName("Should REJECT transaction when amount is GREATER than 1000")
    void shouldRejectTransactionWhenAmountIsGreaterThan1000() {
        // Given
        Transaction transaction = new Transaction(
            "txn-003",
            "account-debit-003",
            "account-credit-003",
            1500.0,
            1,
            "PENDING",
            "c",
            null
        );

        // When
        TransactionValidation result = validationService.validate(transaction);

        // Then
        assertNotNull(result);
        assertEquals("txn-003", result.transactionId());
        assertEquals(ValidationStatus.REJECTED, result.status());
        assertEquals(1500.0, result.amount());
        assertFalse(result.isApproved());
        assertTrue(result.isRejected());
        assertTrue(result.reason().contains("exceeds maximum allowed value"));
    }

    @Test
    @DisplayName("Should REJECT transaction when amount is much GREATER than 1000")
    void shouldRejectTransactionWhenAmountIsMuchGreaterThan1000() {
        // Given
        Transaction transaction = new Transaction(
            "txn-004",
            "account-debit-004",
            "account-credit-004",
            10000.0,
            1,
            "PENDING",
            "c",
            null
        );

        // When
        TransactionValidation result = validationService.validate(transaction);

        // Then
        assertNotNull(result);
        assertEquals(ValidationStatus.REJECTED, result.status());
        assertEquals(10000.0, result.amount());
        assertTrue(result.isRejected());
    }

    @Test
    @DisplayName("Should APPROVE transaction with minimum amount")
    void shouldApproveTransactionWithMinimumAmount() {
        // Given
        Transaction transaction = new Transaction(
            "txn-005",
            "account-debit-005",
            "account-credit-005",
            0.01,
            1,
            "PENDING",
            "c",
            null
        );

        // When
        TransactionValidation result = validationService.validate(transaction);

        // Then
        assertNotNull(result);
        assertEquals(ValidationStatus.APPROVED, result.status());
        assertEquals(0.01, result.amount());
        assertTrue(result.isApproved());
    }

    @Test
    @DisplayName("Should include validated timestamp in result")
    void shouldIncludeValidatedTimestamp() {
        // Given
        Transaction transaction = new Transaction(
            "txn-006",
            "account-debit-006",
            "account-credit-006",
            500.0,
            1,
            "PENDING",
            "c",
            null
        );

        // When
        TransactionValidation result = validationService.validate(transaction);

        // Then
        assertNotNull(result.validatedAt());
        assertTrue(result.validatedAt().toEpochMilli() <= System.currentTimeMillis());
    }
}

