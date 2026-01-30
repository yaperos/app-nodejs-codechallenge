package com.yape.transaction.infrastructure.db;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.out.TransactionRepository;
import com.yape.transaction.infrastructure.db.entity.TransactionEntity;
import org.springframework.stereotype.Component;

@Component
public class TransactionRepositoryAdapter implements TransactionRepository {

  private final JpaRepository jpaRepository;

  public TransactionRepositoryAdapter(JpaRepository jpaRepository) {
    this.jpaRepository = jpaRepository;
  }

  @Override
  public Transaction save(Transaction tx) {
    jpaRepository.save(TransactionEntity.from(tx));
    return tx;
  }

  @Override
  public Optional<Transaction> findById(UUID id) {
    return jpaRepository.findById(id)
      .map(TransactionEntity::toDomain);
  }

  @Override
  public List<Transaction> findAll() {
    return jpaRepository.findAll()
      .stream()
      .map(TransactionEntity::toDomain)
      .toList();
  }
}
