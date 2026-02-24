package com.yape.antifraud.service;

import com.yape.transaction_service.entity.TransactionStatus;
import lombok.Getter;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class AntiFraudService {

    private static final BigDecimal FRAUD_LIMIT = new BigDecimal("1000");

    public TransactionStatus validate(BigDecimal value) {
        if (value == null) {
            throw new IllegalArgumentException("El valor de la transacción no puede ser null");
        }

        if (value.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El valor no puede ser negativo");
        }

        return value.compareTo(FRAUD_LIMIT) > 0
                ? TransactionStatus.REJECTED
                : TransactionStatus.APPROVED;
    }
}