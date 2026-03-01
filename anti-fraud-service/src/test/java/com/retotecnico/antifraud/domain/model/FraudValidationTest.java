package com.retotecnico.antifraud.domain.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FraudValidationTest {

    @Test
    void shouldApproveTransactionUnder1000() {
        UUID id = UUID.randomUUID();
        FraudValidation result = FraudValidation.validate(id, new BigDecimal("500"));
        assertEquals("APPROVED", result.getResultStatus());
    }

    @Test
    void shouldApproveTransactionExactly1000() {
        UUID id = UUID.randomUUID();
        FraudValidation result = FraudValidation.validate(id, new BigDecimal("1000"));
        assertEquals("APPROVED", result.getResultStatus());
    }

    @Test
    void shouldRejectTransactionOver1000() {
        UUID id = UUID.randomUUID();
        FraudValidation result = FraudValidation.validate(id, new BigDecimal("1001"));
        assertEquals("REJECTED", result.getResultStatus());
    }

    @Test
    void shouldRejectTransactionWayOver1000() {
        UUID id = UUID.randomUUID();
        FraudValidation result = FraudValidation.validate(id, new BigDecimal("50000"));
        assertEquals("REJECTED", result.getResultStatus());
    }
}
