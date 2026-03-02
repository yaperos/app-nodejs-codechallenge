package com.yape.antifraud.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ValidationResult Domain Model Tests")
class ValidationResultTest {

    @Test
    @DisplayName("Should create approved result")
    void shouldCreateApprovedResult() {
        UUID transactionId = UUID.randomUUID();

        ValidationResult result = ValidationResult.approved(transactionId);

        assertEquals(transactionId, result.getTransactionExternalId());
        assertEquals(ValidationStatus.APPROVED, result.getStatus());
        assertTrue(result.isApproved());
        assertEquals("Transaction approved", result.getReason());
    }

    @Test
    @DisplayName("Should create rejected result")
    void shouldCreateRejectedResult() {
        UUID transactionId = UUID.randomUUID();
        String reason = "Value exceeds maximum";

        ValidationResult result = ValidationResult.rejected(transactionId, reason);

        assertEquals(transactionId, result.getTransactionExternalId());
        assertEquals(ValidationStatus.REJECTED, result.getStatus());
        assertFalse(result.isApproved());
        assertEquals(reason, result.getReason());
    }

    @Test
    @DisplayName("Should create result with constructor")
    void shouldCreateResultWithConstructor() {
        UUID transactionId = UUID.randomUUID();
        ValidationStatus status = ValidationStatus.APPROVED;
        String reason = "All checks passed";

        ValidationResult result = new ValidationResult(transactionId, status, reason);

        assertEquals(transactionId, result.getTransactionExternalId());
        assertEquals(status, result.getStatus());
        assertEquals(reason, result.getReason());
    }
}
