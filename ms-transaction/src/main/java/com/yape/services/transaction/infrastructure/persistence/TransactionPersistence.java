package com.yape.services.transaction.infrastructure.persistence;

import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.repository.TransactionRepository;
import com.yape.services.transaction.infrastructure.persistence.entity.TransactionEntity;
import com.yape.services.transaction.infrastructure.persistence.repository.TransactionPostgresRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;

/**
 * Persistence implementation for TransactionRepository using PostgreSQL.
 */
@ApplicationScoped
public class TransactionPersistence implements TransactionRepository {

  private final TransactionPostgresRepository repository;

  /**
   * Constructor for TransactionPersistence.
   *
   * @param repository the PostgreSQL repository for transactions
   */
  @Inject
  public TransactionPersistence(TransactionPostgresRepository repository) {
    this.repository = repository;
  }

  @Override
  @Transactional(Transactional.TxType.REQUIRED)
  public Transaction save(Transaction tx) {
    TransactionEntity entity = toEntity(tx);
    TransactionEntity savedEntity = repository.save(entity);
    return toDomain(savedEntity);
  }

  @Override
  @Transactional(Transactional.TxType.SUPPORTS)
  public Optional<Transaction> findByExternalId(UUID externalId) {
    return Optional.ofNullable(repository.findByTransactionExternalId(externalId))
        .map(TransactionPersistence::toDomain);
  }

  private static TransactionEntity toEntity(Transaction domain) {
    if (domain == null) {
      return null;
    }

    TransactionEntity entity = new TransactionEntity();
    entity.setTransactionExternalId(domain.getTransactionExternalId());
    entity.setAccountExternalIdDebit(domain.getAccountExternalIdDebit());
    entity.setAccountExternalIdCredit(domain.getAccountExternalIdCredit());
    entity.setTransferTypeId(domain.getTransferTypeId());
    entity.setTransactionStatusId(domain.getTransactionStatusId());
    entity.setValue(domain.getValue());
    return entity;
  }

  private static Transaction toDomain(TransactionEntity entity) {
    if (entity == null) {
      return null;
    }

    return Transaction.builder()
        .transactionExternalId(entity.getTransactionExternalId())
        .accountExternalIdDebit(entity.getAccountExternalIdDebit())
        .accountExternalIdCredit(entity.getAccountExternalIdCredit())
        .transferTypeId(entity.getTransferTypeId())
        .transactionStatusId(entity.getTransactionStatusId())
        .value(entity.getValue())
        .createdAt(entity.getCreatedAt())
        .build();
  }

  @Override
  @Transactional(Transactional.TxType.REQUIRED)
  public int updateStatus(UUID externalId, Integer newStatusId) {
    return repository.updateStatusByExternalId(externalId, newStatusId);
  }

}
