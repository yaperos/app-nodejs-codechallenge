package com.yape.antifraud.application.usecase;

import com.yape.antifraud.domain.port.in.EvaluateTransactionUseCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@Slf4j
public class EvaluateTransactionUseCaseImpl implements EvaluateTransactionUseCase {

    private static final BigDecimal FRAUD_THRESHOLD = new BigDecimal("1000");

    @Override
    public String evaluate(UUID transactionId, BigDecimal value) {
        log.info("Evaluating transaction {} with value {}", transactionId, value);

        String status;
        if (value.compareTo(FRAUD_THRESHOLD) > 0) {
            status = "REJECTED";
            log.warn("Transaction {} REJECTED - value {} exceeds threshold {}", transactionId, value, FRAUD_THRESHOLD);
        } else {
            status = "APPROVED";
            log.info("Transaction {} APPROVED - value {} within threshold {}", transactionId, value, FRAUD_THRESHOLD);
        }

        return status;
    }
}
