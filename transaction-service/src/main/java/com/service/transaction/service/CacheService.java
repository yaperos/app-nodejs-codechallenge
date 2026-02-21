package com.service.transaction.service;

import com.service.transaction.model.entity.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.time.Duration;
import java.util.UUID;

/**
 * <b>Class</b>: CacheService<br/>
 * Copyright: &copy; 2026.<br/>
 * Company: Yape.<br/>
 *
 * <u>Developed by</u>: <br/>
 * <ul>
 *     <li>Felipe Rosado</li>
 *     <li>February 21, 2026 Creaci&oacute;n de Clase.</li>
 * </ul>
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CacheService {

  private static final String PREFIX = "transaction:";
  private static final Duration TTL = Duration.ofSeconds(60);

  private final ReactiveRedisTemplate<String, Transaction> redisTemplate;

  public Mono<Void> save(Transaction transaction) {
    String key = buildKey(transaction.getTransactionExternalId());
    return redisTemplate.opsForValue()
        .set(key, transaction, TTL)
        .doOnSuccess(v -> log.info("Cached record with key: {}", key))
        .then();
  }

  public Mono<Transaction> findById(UUID transactionExternalId) {
    String key = buildKey(transactionExternalId);
    return redisTemplate.opsForValue()
        .get(key)
        .doOnNext(v -> log.info("Cache found with key: {}", key))
        .doOnSuccess(v -> {
          if (v == null) {
            log.info("Cached not found with key: {}", key);
          }
        });
  }

  public Mono<Void> evict(UUID transactionExternalId) {
    String key = buildKey(transactionExternalId);
    return redisTemplate.opsForValue()
        .delete(key)
        .doOnSuccess(v -> log.info("Invalid cache with key: {}", key))
        .then();
  }

  private String buildKey(UUID transactionExternalId) {
    return PREFIX + transactionExternalId;
  }

}