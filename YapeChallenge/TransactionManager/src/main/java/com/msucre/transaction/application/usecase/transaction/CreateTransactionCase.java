package com.msucre.transaction.application.usecase.transaction;

import com.msucre.shared.model.dto.event.TransactionEventDto;
import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.model.type.TransactionStatus;
import com.msucre.transaction.domain.model.type.TransactionType;
import com.msucre.transaction.domain.repository.TransactionByAccountRepository;
import com.msucre.transaction.domain.repository.TransactionCacheRepository;
import com.msucre.transaction.domain.repository.TransactionRepository;
import com.msucre.transaction.domain.service.EventService;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.UUID;

@Component
public class CreateTransactionCase {

  private final TransactionRepository transactionRepository;

  private final TransactionCacheRepository transactionCacheRepository;

  private final TransactionByAccountRepository transactionByAccountRepository;

  private final EventService eventService;

  public CreateTransactionCase(TransactionRepository transactionRepository,
                               TransactionCacheRepository transactionCacheRepository,
                               TransactionByAccountRepository transactionByAccountRepository,
                               EventService eventService) {
    this.transactionRepository = transactionRepository;
    this.transactionCacheRepository = transactionCacheRepository;
    this.transactionByAccountRepository = transactionByAccountRepository;
    this.eventService = eventService;
  }

  public Mono<UUID> execute(final Transaction transaction) {
    return Mono.fromCallable(() -> {
      transaction.createdAt = System.currentTimeMillis();
      transaction.status = TransactionStatus.PENDING;
      transaction.type = TransactionType.DEPOSIT;
      return transaction;
    }).flatMap(this::createAndProcessTransaction).map(createdTransaction -> createdTransaction.id);
  }

  private Mono<Transaction> createAndProcessTransaction(final Transaction transaction) {
    return transactionRepository.save(transaction)
        .doOnNext(createdTransaction ->
            processTransaction(createdTransaction).subscribeOn(Schedulers.boundedElastic()).subscribe()
        );
  }

  private Mono<Void> processTransaction(final Transaction transaction) {
    return transactionCacheRepository.save(transaction).then(transactionByAccountRepository.save(transaction))
        .then(
            eventService.sendTransactionEvent(new TransactionEventDto(transaction.id.toString(), transaction.amount)));
  }
}

