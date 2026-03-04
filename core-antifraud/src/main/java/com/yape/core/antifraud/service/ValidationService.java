package com.yape.core.antifraud.service;

import com.yape.shared.domain.TransactionData;
import com.yape.shared.domain.TransactionType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ValidationService {
    public TransactionData process(TransactionData transaction) {
        TransactionType status = validateStatus(transaction);
        return transaction.toBuilder()
                .status(status)
                .build();
    }

    private TransactionType validateStatus(TransactionData transaction) {
        if (transaction.getValue().compareTo(BigDecimal.valueOf(1000)) > 0) {
            return TransactionType.REJECTED;
        }
        return TransactionType.APPROVED;
    }
}
