package com.yape.transaction.infrastructure.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.out.TransactionCachePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionCacheAdapter implements TransactionCachePort {

    private static final String KEY_PREFIX = "transaction:";
    private static final Duration TTL_PENDING = Duration.ofSeconds(30);
    private static final Duration TTL_FINAL = Duration.ofMinutes(10);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public Optional<Transaction> get(UUID externalId) {
        try {
            String key = buildKey(externalId);
            String json = redisTemplate.opsForValue().get(key);

            if (json == null) {
                log.debug("Cache miss for transaction with externalId: {}", externalId);
                return Optional.empty();
            }

            Transaction transaction = objectMapper.readValue(json, Transaction.class);
            log.debug("Cache hit for transaction with externalId: {}", externalId);
            return Optional.of(transaction);

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize cached transaction for externalId: {}", externalId, e);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error reading from cache for externalId: {}", externalId, e);
            return Optional.empty();
        }
    }

    @Override
    public void put(Transaction transaction) {
        try {
            String key = buildKey(transaction.getExternalId());
            String json = objectMapper.writeValueAsString(transaction);

            Duration ttl = resolveTtl(transaction.getStatus());
            redisTemplate.opsForValue().set(key, json, ttl);

            log.debug("Transaction cached with externalId: {} and TTL: {}", transaction.getExternalId(), ttl);

        } catch (JsonProcessingException e) {
            log.error("Failed to serialize transaction for caching with externalId: {}",
                    transaction.getExternalId(), e);
        } catch (Exception e) {
            log.error("Error writing to cache for externalId: {}", transaction.getExternalId(), e);
        }
    }

    @Override
    public void evict(UUID externalId) {
        try {
            String key = buildKey(externalId);
            Boolean deleted = redisTemplate.delete(key);
            log.debug("Cache evicted for externalId: {}, result: {}", externalId, deleted);
        } catch (Exception e) {
            log.error("Error evicting cache for externalId: {}", externalId, e);
        }
    }

    private String buildKey(UUID externalId) {
        return KEY_PREFIX + externalId.toString();
    }

    private Duration resolveTtl(TransactionStatus status) {
        if (status == TransactionStatus.PENDING) {
            return TTL_PENDING;
        }
        return TTL_FINAL;
    }
}
