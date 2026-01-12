package com.msucre.transaction.application.usecase.transaction;

import com.msucre.transaction.domain.model.type.TransactionStatus;
import com.msucre.transaction.domain.repository.TransactionByAccountRepository;
import com.msucre.transaction.domain.repository.TransactionRepository;
import com.msucre.transaction.domain.service.EventService;
import com.msucre.transaction.infrastructure.redis.repository.RedisTransactionCacheRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class UpdateValidatedTransactionCase {

  private final EventService eventService;

  private final TransactionRepository transactionRepository;

  private final RedisTransactionCacheRepository redisTransactionCacheRepository;

  private final TransactionByAccountRepository transactionByAccountRepository;

  public UpdateValidatedTransactionCase(EventService eventService, TransactionRepository transactionRepository,
                                        RedisTransactionCacheRepository redisTransactionCacheRepository,
                                        TransactionByAccountRepository transactionByAccountRepository) {
    this.eventService = eventService;
    this.transactionRepository = transactionRepository;
    this.redisTransactionCacheRepository = redisTransactionCacheRepository;
    this.transactionByAccountRepository = transactionByAccountRepository;
  }

  @PostConstruct
  public void init() {
    execute().subscribe();
  }

  public Flux<Void> execute() {
    return eventService.consumeTransactionEventResponses().flatMap(
        transactionEventResponseDto -> processTransaction(transactionEventResponseDto.transactionId(),
            transactionEventResponseDto.isValid() ? TransactionStatus.APPROVED : TransactionStatus.REJECTED));
  }

  private Mono<Void> processTransaction(final String id, final TransactionStatus status) {
    return transactionRepository.updateStatusById(id, status)
        .then(redisTransactionCacheRepository.updateStatusById(id, status))
        .then(transactionRepository.findById(id))
        .flatMap(transaction -> transactionByAccountRepository.updateStatus(transaction, status));
  }
}
