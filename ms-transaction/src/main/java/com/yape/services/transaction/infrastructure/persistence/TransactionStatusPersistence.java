package com.yape.services.transaction.infrastructure.persistence;

import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.repository.TransactionStatusRepository;
import com.yape.services.transaction.infrastructure.persistence.entity.TransactionStatusEntity;
import com.yape.services.transaction.infrastructure.persistence.repository.TransactionStatusPostgresRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.Optional;

/**
 * Persistence implementation for TransactionStatus.
 */
@ApplicationScoped
public class TransactionStatusPersistence implements TransactionStatusRepository {

  private final TransactionStatusPostgresRepository repository;

  /**
   * Constructor for TransactionStatusPersistence.
   *
   * @param repository the PostgreSQL repository for transaction statuses
   */
  @Inject
  public TransactionStatusPersistence(TransactionStatusPostgresRepository repository) {
    this.repository = repository;
  }

  @Override
  @Transactional(Transactional.TxType.SUPPORTS)
  public Optional<TransactionStatus> findByCode(String code) {
    return Optional.ofNullable(repository.findByCode(code))
        .map(TransactionStatusPersistence::toDomain);
  }

  @Override
  @Transactional(Transactional.TxType.SUPPORTS)
  public Optional<TransactionStatus> findById(Integer id) {
    return Optional.ofNullable(repository.findById(id))
        .map(TransactionStatusPersistence::toDomain);
  }

  private static TransactionStatus toDomain(TransactionStatusEntity entity) {
    if (entity == null) {
      return null;
    }

    return TransactionStatus.builder()
        .transactionStatusId(entity.getTransactionStatusId())
        .code(entity.getCode())
        .name(entity.getName())
        .build();
  }

}
