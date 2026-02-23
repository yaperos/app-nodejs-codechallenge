package com.kafka.productor.application.usecase.service.get;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.port.TransactionCachePort;
import com.kafka.productor.domain.port.TransactionRepositoryPort;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetTransactionService implements GetTransactionUseCase {

    private final TransactionRepositoryPort transactionRepositoryPort;
    private final TransactionCachePort transactionCachePort;

    @Override
    public Optional<Transaction> execute(UUID transactionExternalId) {
        log.info("GetTransactionService:execute: {}", transactionExternalId);
        Optional<Transaction> cached = transactionCachePort.findById(transactionExternalId);
        if (cached.isPresent()) {
            return cached;
        }

        Optional<Transaction> transaction = transactionRepositoryPort
                .findByTransactionExternalId(transactionExternalId);

        log.info("GetTransactionService:transaction find: {}", transaction);

        transaction.ifPresent(transactionCachePort::save);

        return transaction;
    }

}
