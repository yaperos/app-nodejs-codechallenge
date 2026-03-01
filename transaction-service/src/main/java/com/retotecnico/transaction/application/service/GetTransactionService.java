package com.retotecnico.transaction.application.service;

import com.retotecnico.transaction.domain.model.Transaction;
import com.retotecnico.transaction.domain.port.in.GetTransactionUseCase;
import com.retotecnico.transaction.domain.port.out.TransactionCacheRepository;
import com.retotecnico.transaction.domain.port.out.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetTransactionService implements GetTransactionUseCase {

    private final TransactionRepository transactionRepository;
    private final TransactionCacheRepository transactionCacheRepository;

    @Override
    public Transaction execute(UUID transactionExternalId) {
        // CQRS: First try Redis (Read model), then fallback to PostgreSQL (Write model)
        return transactionCacheRepository.findById(transactionExternalId)
                .orElseGet(() -> {
                    log.info("Cache miss for transaction: {}, fetching from database", transactionExternalId);
                    Transaction transaction = transactionRepository.findById(transactionExternalId)
                            .orElseThrow(() -> new RuntimeException(
                                    "Transaction not found: " + transactionExternalId));

                    // Repopulate cache
                    transactionCacheRepository.save(transaction);
                    return transaction;
                });
    }
}
