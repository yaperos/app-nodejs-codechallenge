package org.beh.transactionservice.infrastructure.cache;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.beh.transactionservice.application.dto.TransactionDTO;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

/**
 * Cache-Aside (Lazy Loading) Pattern.
 *
 * Read flow:  Check cache → if miss, read DB → populate cache → return
 * Write flow: Write DB → update/evict cache (we update to avoid a cold miss spike)
 *
 * Why not @Cacheable? We need fine-grained control over TTL and error handling.
 * Redis failures should be non-fatal — always fall back to DB gracefully.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String KEY_PREFIX = "txn:";
    // 10 minutes TTL — after status update we refresh immediately, so stale risk is low
    private static final Duration TTL = Duration.ofMinutes(10);

    public void put(TransactionDTO dto) {
        try {
            // use the actual DTO property name
            redisTemplate.opsForValue().set(key(dto.getTransactionExternalId()), dto, TTL);
        } catch (Exception e) {
            // Cache failure must NEVER break the main flow
            log.warn("Cache write failed for transaction {}: {}", dto.getTransactionExternalId(), e.getMessage());
        }
    }

    public Optional<TransactionDTO> get(UUID id) {
        try {
            Object value = redisTemplate.opsForValue().get(key(id));
            if (value instanceof TransactionDTO dto) {
                return Optional.of(dto);
            }
        } catch (Exception e) {
            log.warn("Cache read failed for transaction {}: {}", id, e.getMessage());
        }
        return Optional.empty();
    }

    public void evict(UUID id) {
        try {
            redisTemplate.delete(key(id));
        } catch (Exception e) {
            log.warn("Cache eviction failed for transaction {}: {}", id, e.getMessage());
        }
    }

    private String key(UUID id) {
        return KEY_PREFIX + id;
    }
}
