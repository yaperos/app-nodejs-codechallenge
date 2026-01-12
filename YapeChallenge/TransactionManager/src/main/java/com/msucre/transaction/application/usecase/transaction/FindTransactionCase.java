package com.msucre.transaction.application.usecase.transaction;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.repository.TransactionCacheRepository;
import com.msucre.transaction.domain.repository.TransactionRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class FindTransactionCase {

  private final TransactionCacheRepository transactionCacheRepository;
  private final TransactionRepository transactionRepository;


  public FindTransactionCase(TransactionCacheRepository transactionCacheRepository,
                             TransactionRepository transactionRepository) {
    this.transactionCacheRepository = transactionCacheRepository;
    this.transactionRepository = transactionRepository;
  }

  public Mono<Transaction> execute(final String transactionId) {
    return transactionCacheRepository.findById(transactionId).switchIfEmpty(
        transactionRepository.findById(transactionId)
            .flatMap(transaction -> transactionCacheRepository.save(transaction).thenReturn(transaction)));
  }
}
