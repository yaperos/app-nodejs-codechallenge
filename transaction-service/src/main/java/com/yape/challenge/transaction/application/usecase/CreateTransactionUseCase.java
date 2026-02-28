package com.yape.challenge.transaction.application.usecase;

import com.yape.challenge.transaction.domain.messaging.EventPublisher;
import com.yape.challenge.transaction.domain.model.Transaction;
import com.yape.challenge.transaction.domain.model.TransactionStatus;
import com.yape.challenge.transaction.domain.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CreateTransactionUseCase {

    private final TransactionRepository transactionRepository;
    private final EventPublisher eventPublisher;

    public Mono<Transaction> execute(Transaction transaction) {
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setCreatedAt(LocalDateTime.now());

        return transactionRepository.save(transaction)
                .flatMap(savedTransaction -> eventPublisher.publishTransactionCreatedEvent(savedTransaction)
                        .thenReturn(savedTransaction));
    }
}
