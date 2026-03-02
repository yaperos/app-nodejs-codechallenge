package com.yape.antifraud.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("FraudEvaluation - Domain Business Rules")
class FraudEvaluationTest {

    @ParameterizedTest(name = "value={0} should be APPROVED")
    @ValueSource(strings = {"1", "500", "999.99", "1000"})
    void shouldApproveTransactionsUpTo1000(String value) {
        FraudEvaluation evaluation = new FraudEvaluation(UUID.randomUUID(), new BigDecimal(value))
                .evaluate();

        assertThat(evaluation.isApproved()).isTrue();
        assertThat(evaluation.getResult()).isEqualTo(FraudResult.APPROVED);
    }

    @ParameterizedTest(name = "value={0} should be REJECTED")
    @ValueSource(strings = {"1000.01", "1001", "5000", "999999"})
    void shouldRejectTransactionsOver1000(String value) {
        FraudEvaluation evaluation = new FraudEvaluation(UUID.randomUUID(), new BigDecimal(value))
                .evaluate();

        assertThat(evaluation.isRejected()).isTrue();
        assertThat(evaluation.getResult()).isEqualTo(FraudResult.REJECTED);
    }

    @Test
    @DisplayName("Should preserve transaction ID after evaluation")
    void shouldPreserveTransactionId() {
        UUID transactionId = UUID.randomUUID();
        FraudEvaluation evaluation = new FraudEvaluation(transactionId, BigDecimal.valueOf(500))
                .evaluate();

        assertThat(evaluation.getTransactionExternalId()).isEqualTo(transactionId);
    }
}
