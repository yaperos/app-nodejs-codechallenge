package com.yape.challenge.transaction.application.usecase;

import com.yape.challenge.transaction.domain.model.Transaction;
import com.yape.challenge.transaction.domain.model.TransactionStatus;
import com.yape.challenge.transaction.domain.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateTransactionStatusUseCase {

    private final TransactionRepository transactionRepository;

    public Mono<Transaction> execute(UUID id, TransactionStatus status) {
        return transactionRepository.updateStatus(id, status);
    }
}
