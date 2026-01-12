package com.msucre.transaction.infrastructure.postgresql.repository.impl;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.model.type.TransactionStatus;
import com.msucre.transaction.domain.repository.TransactionRepository;
import com.msucre.transaction.infrastructure.postgresql.mapper.TransactionMapper;
import com.msucre.transaction.infrastructure.postgresql.repository.TransactionEntityRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class TransactionRepositoryImpl implements TransactionRepository {

  private final TransactionEntityRepository transactionEntityRepository;

  public TransactionRepositoryImpl(TransactionEntityRepository transactionEntityRepository) {
    this.transactionEntityRepository = transactionEntityRepository;
  }

  @Override
  public Mono<Transaction> save(Transaction transaction) {
    return transactionEntityRepository.save(TransactionMapper.toEntity(transaction)).map(transactionEntity -> {
      transaction.id = transactionEntity.id;
      return transaction;
    });
  }

  @Override
  public Mono<Void> updateStatusById(String id, TransactionStatus status) {
    return transactionEntityRepository.findById(UUID.fromString(id)).map(transactionEntity -> {
          transactionEntity.status = status;
          return transactionEntity;
        }).flatMap(transactionEntityRepository::save)
        .then();
  }

  @Override
  public Mono<Transaction> findById(String id) {
    return transactionEntityRepository.findById(UUID.fromString(id)).map(TransactionMapper::toTransaction);
  }
}
