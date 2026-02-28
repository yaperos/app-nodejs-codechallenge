package com.yape.challenge.transaction.infrastructure.adapters.out.database;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import com.yape.challenge.transaction.domain.model.Transaction;
import com.yape.challenge.transaction.domain.model.TransactionStatus;
import com.yape.challenge.transaction.domain.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseTransactionRepositoryAdapter implements TransactionRepository {

    private final TransactionR2dbcRepository repository;
    private final ReactiveStringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_KEY_PREFIX = "transaction:";

    @Override
    public Mono<Transaction> save(Transaction transaction) {
        TransactionEntity entity = TransactionEntity.builder()
                .id(transaction.getId())
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .tranferTypeId(transaction.getTranferTypeId())
                .value(transaction.getValue())
                .status(transaction.getStatus())
                .createdAt(transaction.getCreatedAt())
                .build();

        return repository.save(entity)
                .flatMap(this::saveToCache)
                .map(this::mapToDomain);
    }

    @Override
    public Mono<Transaction> findById(UUID id) {
        return getFromCache(id)
                .doOnNext(e -> log.info("[CACHE HIT] Transaction {} retrieved from Redis", id))
                .switchIfEmpty(
                        repository.findById(id)
                                .doOnNext(e -> log.info("[CACHE MISS] Transaction {} retrieved from PostgreSQL", id))
                                .flatMap(this::saveToCache))
                .map(this::mapToDomain);
    }

    @Override
    public Mono<Transaction> updateStatus(UUID id, TransactionStatus status) {
        return repository.findById(id)
                .flatMap(entity -> {
                    entity.setStatus(status);
                    return repository.save(entity);
                })
                .flatMap(this::saveToCache)
                .map(this::mapToDomain);
    }

    private Mono<TransactionEntity> saveToCache(TransactionEntity entity) {
        try {
            String json = objectMapper.writeValueAsString(entity);
            return redisTemplate.opsForValue()
                    .set(CACHE_KEY_PREFIX + entity.getId(), json)
                    .thenReturn(entity)
                    .onErrorResume(e -> {
                        log.error("Failed to save transaction to Redis cache", e);
                        return Mono.just(entity);
                    });
        } catch (JacksonException e) {
            log.error("Failed to serialize transaction for Redis cache", e);
            return Mono.just(entity);
        }
    }

    private Mono<TransactionEntity> getFromCache(UUID id) {
        return redisTemplate.opsForValue()
                .get(CACHE_KEY_PREFIX + id)
                .flatMap(json -> {
                    try {
                        TransactionEntity entity = objectMapper.readValue(json, TransactionEntity.class);
                        return Mono.just(entity);
                    } catch (JacksonException e) {
                        log.error("[CACHE ERROR] Failed to deserialize transaction {} from Redis, falling back to DB",
                                id, e);
                        return Mono.empty();
                    }
                })
                .onErrorResume(e -> {
                    log.error("[CACHE ERROR] Failed to connect to Redis for transaction {}, falling back to DB", id, e);
                    return Mono.empty();
                });
    }

    private Transaction mapToDomain(TransactionEntity entity) {
        return Transaction.builder()
                .id(entity.getId())
                .accountExternalIdDebit(entity.getAccountExternalIdDebit())
                .accountExternalIdCredit(entity.getAccountExternalIdCredit())
                .tranferTypeId(entity.getTranferTypeId())
                .value(entity.getValue())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
