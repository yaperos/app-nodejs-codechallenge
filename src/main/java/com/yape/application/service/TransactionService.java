package com.yape.application.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yape.application.port.in.CreateTransactionUseCase;
import com.yape.application.port.in.GetTransactionUseCase;
import com.yape.application.port.out.TransactionEventPublishPort;
import com.yape.application.port.out.TransactionRepositoryPort;
import com.yape.domain.exception.NotFoundException;
import com.yape.domain.model.Transaction;
import com.yape.domain.model.TransactionStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TransactionService implements CreateTransactionUseCase, GetTransactionUseCase {

    private final TransactionRepositoryPort transactionRepository;
    private final TransactionEventPublishPort transactionEventPublisher;

    @Override
    @Transactional
    public Mono<Transaction> createTransaction(Transaction transaction) {
        transaction.setStatus(TransactionStatus.PENDING);
        return transactionRepository.save(transaction)
        .doOnError(e -> log.error("Error saving transaction: {}", e.getMessage(), e))
        .doOnSuccess(savedTransaction -> {
            log.info("Transaction created: {}", savedTransaction);
            transactionEventPublisher.publishTransactionCreated(savedTransaction).subscribe();
        });
    }

    @Override
    public Mono<Transaction> getTransaction(UUID transactionExternalId) {
        return transactionRepository.findById(transactionExternalId)
                .switchIfEmpty(Mono.error(new NotFoundException(
                        "Transaction not found with id: " + transactionExternalId)));
    }
}
