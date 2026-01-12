package com.msucre.transaction.infrastructure.cassandra.repository.impl;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.model.type.TransactionStatus;
import com.msucre.transaction.domain.repository.TransactionByAccountRepository;
import com.msucre.transaction.infrastructure.cassandra.mapper.TransactionByAccountMapper;
import com.msucre.transaction.infrastructure.cassandra.repository.TransactionByAccountEntityRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.UUID;

@Repository
public class TransactionByAccountRepositoryImpl implements TransactionByAccountRepository {

  private final TransactionByAccountEntityRepository transactionByAccountEntityRepository;

  public TransactionByAccountRepositoryImpl(TransactionByAccountEntityRepository transactionByAccountEntityRepository) {
    this.transactionByAccountEntityRepository = transactionByAccountEntityRepository;
  }

  @Override
  public Mono<Void> save(Transaction transaction) {
    return transactionByAccountEntityRepository.save(TransactionByAccountMapper.toEntity(transaction)).then();
  }

  @Override
  public Flux<Transaction> findTransactionsByAccount(UUID accountId) {
    return transactionByAccountEntityRepository.findAllBySourceAccountId(accountId)
        .map(TransactionByAccountMapper::toTransaction);
  }

  @Override
  public Mono<Void> updateStatus(Transaction transaction, TransactionStatus status) {
    return Mono.fromCallable(() -> {
      transaction.status = status;
      return TransactionByAccountMapper.toEntity(transaction);
    }).flatMap(transactionByAccountEntityRepository::save).then();
  }
}
