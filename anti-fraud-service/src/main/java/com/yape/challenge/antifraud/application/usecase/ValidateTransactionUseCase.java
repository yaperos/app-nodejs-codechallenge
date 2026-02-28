package com.yape.challenge.antifraud.application.usecase;

import com.yape.challenge.antifraud.domain.messaging.EventPublisher;
import com.yape.challenge.antifraud.domain.model.Transaction;
import com.yape.challenge.antifraud.domain.model.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class ValidateTransactionUseCase {

    private final EventPublisher eventPublisher;

    public Mono<Void> execute(Transaction transaction) {
        log.info("Validating transaction {} with value {}", transaction.getId(), transaction.getValue());

        TransactionStatus status = transaction.getValue() > 1000
                ? TransactionStatus.REJECTED
                : TransactionStatus.APPROVED;

        return eventPublisher.publishTransactionStatusUpdate(transaction.getId(), status)
                .doOnSuccess(v -> log.info("Successfully validated transaction {} with status {}", transaction.getId(),
                        status));
    }
}
