package com.yape.antifraud.application.usecase;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("EvaluateTransactionUseCase Unit Tests")
class EvaluateTransactionUseCaseTest {

    private EvaluateTransactionUseCaseImpl useCase;

    @BeforeEach
    void setUp() {
        useCase = new EvaluateTransactionUseCaseImpl();
    }

    @Test
    @DisplayName("Should APPROVE transaction when value is less than 1000")
    void shouldApproveTransactionWhenValueIsLessThan1000() {
        String result = useCase.evaluate(UUID.randomUUID(), new BigDecimal("500.00"));
        assertEquals("APPROVED", result);
    }

    @Test
    @DisplayName("Should APPROVE transaction when value is exactly 1000 (boundary)")
    void shouldApproveTransactionWhenValueIsExactly1000() {
        String result = useCase.evaluate(UUID.randomUUID(), new BigDecimal("1000.00"));
        assertEquals("APPROVED", result);
    }

    @Test
    @DisplayName("Should REJECT transaction when value is 1001 (boundary)")
    void shouldRejectTransactionWhenValueIs1001() {
        String result = useCase.evaluate(UUID.randomUUID(), new BigDecimal("1001.00"));
        assertEquals("REJECTED", result);
    }

    @Test
    @DisplayName("Should REJECT transaction when value is greater than 1000")
    void shouldRejectTransactionWhenValueIsGreaterThan1000() {
        String result = useCase.evaluate(UUID.randomUUID(), new BigDecimal("5000.00"));
        assertEquals("REJECTED", result);
    }

    @Test
    @DisplayName("Should REJECT transaction when value is very large")
    void shouldRejectTransactionWhenValueIsVeryLarge() {
        String result = useCase.evaluate(UUID.randomUUID(), new BigDecimal("999999.99"));
        assertEquals("REJECTED", result);
    }

    @Test
    @DisplayName("Should APPROVE transaction when value is very small")
    void shouldApproveTransactionWhenValueIsVerySmall() {
        String result = useCase.evaluate(UUID.randomUUID(), new BigDecimal("0.01"));
        assertEquals("APPROVED", result);
    }

    @Test
    @DisplayName("Should APPROVE transaction when value is zero")
    void shouldApproveTransactionWhenValueIsZero() {
        String result = useCase.evaluate(UUID.randomUUID(), BigDecimal.ZERO);
        assertEquals("APPROVED", result);
    }

    @Test
    @DisplayName("Should APPROVE transaction when value is 999.99")
    void shouldApproveTransactionWhenValueIs999_99() {
        String result = useCase.evaluate(UUID.randomUUID(), new BigDecimal("999.99"));
        assertEquals("APPROVED", result);
    }

    @Test
    @DisplayName("Should REJECT transaction when value is 1000.01")
    void shouldRejectTransactionWhenValueIs1000_01() {
        String result = useCase.evaluate(UUID.randomUUID(), new BigDecimal("1000.01"));
        assertEquals("REJECTED", result);
    }
}
