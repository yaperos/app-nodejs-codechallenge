package com.kafka.productor.infrastructure.cache;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.kafka.productor.domain.model.Transaction;
import com.kafka.productor.domain.port.TransactionCachePort;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisTransactionCacheAdapter implements TransactionCachePort {

    private final RedisTemplate<String, Transaction> redisTemplate;

    private static final String PREFIX = "transaction:";

    @Override
    public Optional<Transaction> findById(UUID transactionExternalId) {
        log.info("RedisTransactionCacheAdapter:findById: {}" + transactionExternalId);
        Transaction transaction =
                redisTemplate.opsForValue().get(PREFIX + transactionExternalId);

        return Optional.ofNullable(transaction);
    }

    @Override
    public void save(Transaction transaction) {
        log.info("RedisTransactionCacheAdapter:save: {}" + transaction);
        redisTemplate.opsForValue().set(
                PREFIX + transaction.getTransactionExternalId(),
                transaction,
                Duration.ofMinutes(10)
        );
    }

    @Override
    public void delete(UUID transactionExternalId) {
        redisTemplate.delete(PREFIX + transactionExternalId);
    }
    
}
