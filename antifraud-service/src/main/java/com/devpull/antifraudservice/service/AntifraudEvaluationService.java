package com.devpull.antifraudservice.service;

import com.devpull.antifraudservice.dto.TransactionCreatedEvent;
import com.devpull.antifraudservice.dto.TransactionStatusChangedEvent;
import com.devpull.antifraudservice.enums.TransactionStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AntifraudEvaluationService {

    private static final double THRESHOLD = 1000.0;

    public TransactionStatusChangedEvent evaluate(TransactionCreatedEvent tx) {
        boolean rejected = tx.amount() != null && tx.amount() > THRESHOLD;

        TransactionStatus status = rejected ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

        String reason = rejected
                ? "Amount exceeds threshold (" + THRESHOLD + ")"
                : "OK";

        return new TransactionStatusChangedEvent(
                tx.transactionId(),
                status,
                Instant.now(),
                reason
        );
    }
}
