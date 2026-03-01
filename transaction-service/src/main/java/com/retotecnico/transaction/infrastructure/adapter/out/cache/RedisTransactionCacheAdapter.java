package com.retotecnico.transaction.infrastructure.adapter.out.cache;

import com.retotecnico.transaction.application.dto.TransactionResponse;
import com.retotecnico.transaction.domain.model.Transaction;
import com.retotecnico.transaction.domain.model.TransactionStatus;
import com.retotecnico.transaction.domain.model.TransferType;
import com.retotecnico.transaction.domain.port.out.TransactionCacheRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Adapter implementing the output port for CQRS read model using Redis.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedisTransactionCacheAdapter implements TransactionCacheRepository {

    private static final String CACHE_PREFIX = "transaction:";
    private static final long TTL_HOURS = 24;

    private final RedisTemplate<String, TransactionResponse> redisTemplate;

    @Override
    public void save(Transaction transaction) {
        String key = CACHE_PREFIX + transaction.getTransactionExternalId();
        TransactionResponse response = TransactionResponse.fromDomain(transaction);
        redisTemplate.opsForValue().set(key, response, TTL_HOURS, TimeUnit.HOURS);
        log.debug("Cached transaction: {}", transaction.getTransactionExternalId());
    }

    @Override
    public Optional<Transaction> findById(UUID transactionExternalId) {
        String key = CACHE_PREFIX + transactionExternalId;
        TransactionResponse cached = redisTemplate.opsForValue().get(key);

        if (cached == null) {
            return Optional.empty();
        }

        // Convert cached response back to domain object
        Transaction transaction = Transaction.builder()
                .transactionExternalId(cached.getTransactionExternalId())
                .transferType(TransferType.valueOf(cached.getTransactionType().getName().toUpperCase()))
                .status(TransactionStatus.valueOf(cached.getTransactionStatus().getName().toUpperCase()))
                .value(cached.getValue())
                .createdAt(cached.getCreatedAt())
                .build();

        log.debug("Cache hit for transaction: {}", transactionExternalId);
        return Optional.of(transaction);
    }

    @Override
    public void deleteById(UUID transactionExternalId) {
        String key = CACHE_PREFIX + transactionExternalId;
        redisTemplate.delete(key);
    }
}
