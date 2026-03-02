package com.yape.antifraud.domain.service;

import com.yape.antifraud.domain.model.TransactionToValidate;
import com.yape.antifraud.domain.model.ValidationResult;
import com.yape.antifraud.domain.model.ValidationStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Fraud Validation Service Unit Tests")
class FraudValidationServiceTest {

    private FraudValidationService fraudValidationService;

    @BeforeEach
    void setUp() throws Exception {
        fraudValidationService = new FraudValidationService();
        // Set the maxTransactionValue using reflection (since it's injected via @ConfigProperty)
        Field maxValueField = FraudValidationService.class.getDeclaredField("maxTransactionValue");
        maxValueField.setAccessible(true);
        maxValueField.set(fraudValidationService, new BigDecimal("1000"));
    }

    @Test
    @DisplayName("Should approve transaction with value less than 1000")
    void shouldApproveTransactionWithValueLessThan1000() {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionToValidate transaction = new TransactionToValidate(transactionId, new BigDecimal("500.00"));

        // When
        ValidationResult result = fraudValidationService.validate(transaction);

        // Then
        assertNotNull(result);
        assertEquals(transactionId, result.getTransactionExternalId());
        assertEquals(ValidationStatus.APPROVED, result.getStatus());
        assertTrue(result.isApproved());
    }

    @Test
    @DisplayName("Should approve transaction with value exactly 1000")
    void shouldApproveTransactionWithValueExactly1000() {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionToValidate transaction = new TransactionToValidate(transactionId, new BigDecimal("1000.00"));

        // When
        ValidationResult result = fraudValidationService.validate(transaction);

        // Then
        assertEquals(ValidationStatus.APPROVED, result.getStatus());
        assertTrue(result.isApproved());
    }

    @Test
    @DisplayName("Should reject transaction with value greater than 1000")
    void shouldRejectTransactionWithValueGreaterThan1000() {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionToValidate transaction = new TransactionToValidate(transactionId, new BigDecimal("1001.00"));

        // When
        ValidationResult result = fraudValidationService.validate(transaction);

        // Then
        assertNotNull(result);
        assertEquals(transactionId, result.getTransactionExternalId());
        assertEquals(ValidationStatus.REJECTED, result.getStatus());
        assertFalse(result.isApproved());
        assertTrue(result.getReason().contains("exceeds maximum"));
    }

    @ParameterizedTest
    @CsvSource({
        "0.01, APPROVED",
        "100, APPROVED",
        "500, APPROVED",
        "999.99, APPROVED",
        "1000, APPROVED",
        "1000.01, REJECTED",
        "1500, REJECTED",
        "5000, REJECTED",
        "10000, REJECTED"
    })
    @DisplayName("Should validate transactions based on value threshold")
    void shouldValidateTransactionsBasedOnValueThreshold(String value, ValidationStatus expectedStatus) {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionToValidate transaction = new TransactionToValidate(transactionId, new BigDecimal(value));

        // When
        ValidationResult result = fraudValidationService.validate(transaction);

        // Then
        assertEquals(expectedStatus, result.getStatus());
    }

    @Test
    @DisplayName("Should handle very large transaction values")
    void shouldHandleVeryLargeTransactionValues() {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionToValidate transaction = new TransactionToValidate(
                transactionId, 
                new BigDecimal("999999999.99")
        );

        // When
        ValidationResult result = fraudValidationService.validate(transaction);

        // Then
        assertEquals(ValidationStatus.REJECTED, result.getStatus());
    }

    @Test
    @DisplayName("Should handle very small transaction values")
    void shouldHandleVerySmallTransactionValues() {
        // Given
        UUID transactionId = UUID.randomUUID();
        TransactionToValidate transaction = new TransactionToValidate(
                transactionId, 
                new BigDecimal("0.01")
        );

        // When
        ValidationResult result = fraudValidationService.validate(transaction);

        // Then
        assertEquals(ValidationStatus.APPROVED, result.getStatus());
    }
}
