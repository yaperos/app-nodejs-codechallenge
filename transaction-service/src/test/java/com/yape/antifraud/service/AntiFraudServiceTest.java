package com.yape.antifraud.service;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Tests del AntiFraudService")
class AntiFraudServiceTest {

    private AntiFraudService service;

    @BeforeEach
    void setUp() {
        service = new AntiFraudService();
    }

    @Test
    @DisplayName("Debe aprobar transacción con valor menor a 1000")
    void xshouldApproveTransactionWhenValueLessThan1000() {
        BigDecimal value = new BigDecimal("500.00");

        String result = String.valueOf(service.validate(value));

        assertEquals("APPROVED", result);
    }

    @Test
    @DisplayName("Debe rechazar transacción con valor mayor a 1000")
    void shouldRejectTransactionWhenValueGreaterThan1000() {
        BigDecimal value = new BigDecimal("1500.00");

        String result = String.valueOf(service.validate(value));

        assertEquals("REJECTED", result);
    }

    @Test
    @DisplayName("Debe aprobar transacción con valor exactamente 1000")
    void shouldApproveTransactionWhenValueEquals1000() {
        BigDecimal value = new BigDecimal("1000.00");

        String result = String.valueOf(service.validate(value));

        assertEquals("APPROVED", result);
    }

    @ParameterizedTest
    @CsvSource({
            "0.01, APPROVED",
            "999.99, APPROVED",
            "1000.00, APPROVED",
            "1000.01, REJECTED",
            "10000.00, REJECTED"
    })
    @DisplayName("Debe validar correctamente múltiples valores")
    void shouldValidateMultipleValues(BigDecimal value, String expectedStatus) {
        String result = String.valueOf(service.validate(value));

        assertEquals(expectedStatus, result);
    }

    @Test
    @DisplayName("Debe lanzar excepción cuando el valor es nulo")
    void shouldThrowExceptionWhenValueIsNull() {
        assertThrows(IllegalArgumentException.class, () -> {
            service.validate(null);
        });
    }
}