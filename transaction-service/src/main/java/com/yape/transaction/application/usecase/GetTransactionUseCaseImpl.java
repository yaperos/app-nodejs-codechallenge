package com.yape.transaction.application.usecase;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import com.yape.transaction.domain.port.out.TransactionCachePort;
import com.yape.transaction.domain.port.out.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetTransactionUseCaseImpl implements GetTransactionUseCase {

    private final TransactionRepository transactionRepository;
    private final TransactionCachePort transactionCachePort;

    @Override
    public Transaction getByExternalId(UUID externalId) {
        Optional<Transaction> cached = transactionCachePort.get(externalId);
        if (cached.isPresent()) {
            log.debug("Transaction found in cache for externalId: {}", externalId);
            return cached.get();
        }

        Transaction transaction = transactionRepository.findByExternalId(externalId)
                .orElseThrow(() -> {
                    log.warn("Transaction not found for externalId: {}", externalId);
                    return new RuntimeException("Transaction not found with externalId: " + externalId);
                });

        transactionCachePort.put(transaction);
        log.debug("Transaction cached for externalId: {}", externalId);

        return transaction;
    }
}
