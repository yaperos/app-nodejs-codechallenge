package com.yape.antifraudservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
public class FraudValidationService {

    private static final BigDecimal MAX_ALLOWED_VALUE = new BigDecimal("1000");

    public boolean isTransactionValid(BigDecimal value) {
        boolean isValid = value.compareTo(MAX_ALLOWED_VALUE) <= 0;
        log.info("Transaction validation result: {} (value: {}, max: {})",
                isValid ? "APPROVED" : "REJECTED", value, MAX_ALLOWED_VALUE);
        return isValid;
    }
}
