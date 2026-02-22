package com.yape.antifraud.domain.service;

import com.yape.antifraud.domain.model.FraudEvaluation;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class FraudEvaluationServiceTest {

    private final FraudEvaluationService service = new FraudEvaluationService();

    @Test
    void shouldApproveTransactionWithValueLessThan1000() {
        FraudEvaluation result = service.evaluate(UUID.randomUUID(), new BigDecimal("500.00"));
        assertThat(result.status()).isEqualTo("approved");
        assertThat(result.isApproved()).isTrue();
    }

    @Test
    void shouldApproveTransactionWithValueExactly1000() {
        FraudEvaluation result = service.evaluate(UUID.randomUUID(), new BigDecimal("1000.00"));
        assertThat(result.status()).isEqualTo("approved");
    }

    @Test
    void shouldRejectTransactionWithValueGreaterThan1000() {
        FraudEvaluation result = service.evaluate(UUID.randomUUID(), new BigDecimal("1000.01"));
        assertThat(result.status()).isEqualTo("rejected");
        assertThat(result.isApproved()).isFalse();
    }

    @Test
    void shouldRejectTransactionWithLargeValue() {
        FraudEvaluation result = service.evaluate(UUID.randomUUID(), new BigDecimal("999999.99"));
        assertThat(result.status()).isEqualTo("rejected");
    }

    @ParameterizedTest
    @ValueSource(strings = {"0.01", "1.00", "100.00", "999.99", "1000.00"})
    void shouldApproveTransactionsUpTo1000(String value) {
        FraudEvaluation result = service.evaluate(UUID.randomUUID(), new BigDecimal(value));
        assertThat(result.status()).isEqualTo("approved");
    }

    @ParameterizedTest
    @ValueSource(strings = {"1000.01", "1001.00", "5000.00", "10000.00"})
    void shouldRejectTransactionsOver1000(String value) {
        FraudEvaluation result = service.evaluate(UUID.randomUUID(), new BigDecimal(value));
        assertThat(result.status()).isEqualTo("rejected");
    }
}
