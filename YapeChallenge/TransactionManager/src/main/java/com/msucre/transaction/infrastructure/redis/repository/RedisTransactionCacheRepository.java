package com.msucre.transaction.infrastructure.redis.repository;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.model.type.TransactionStatus;
import com.msucre.transaction.domain.repository.TransactionCacheRepository;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Repository
public class RedisTransactionCacheRepository implements TransactionCacheRepository {

  private static final long TTL_MINUTES = 5;

  private final ReactiveRedisTemplate<String, Transaction> reactiveRedisTemplate;


  public RedisTransactionCacheRepository(ReactiveRedisTemplate<String, Transaction> reactiveRedisTemplate) {
    this.reactiveRedisTemplate = reactiveRedisTemplate;
  }

  @Override
  public Mono<Void> save(Transaction transaction) {
    return reactiveRedisTemplate.opsForValue()
        .set(transaction.id.toString(), transaction, Duration.ofMinutes(TTL_MINUTES)).then();
  }

  @Override
  public Mono<Void> updateStatusById(String id, TransactionStatus status) {
    return reactiveRedisTemplate.opsForValue().get(id).map(transaction -> {
          transaction.status = status;
          return transaction;
        })
        .flatMap(updatedTransaction -> reactiveRedisTemplate.opsForValue().set(id, updatedTransaction)).then();
  }

  @Override
  public Mono<Transaction> findById(String id) {
    return reactiveRedisTemplate.opsForValue().get(id);
  }
}
