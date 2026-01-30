package com.yape.services.transaction.infrastructure.persistence.repository;

import com.yape.services.transaction.infrastructure.persistence.entity.TransactionEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;

/**
 * Repository for transaction entities in PostgreSQL using Panache.
 */
@ApplicationScoped
public class TransactionPostgresRepository
    implements PanacheRepositoryBase<TransactionEntity, Integer> {

  /**
   * Finds a transaction entity by its external ID.
   *
   * @param transactionExternalId the external ID of the transaction
   * @return the transaction entity
   */
  public TransactionEntity findByTransactionExternalId(UUID transactionExternalId) {
    return find("transactionExternalId", transactionExternalId).firstResult();
  }

  /**
   * Saves a transaction entity.
   *
   * @param entity the entity to save
   * @return the saved entity
   */
  public TransactionEntity save(TransactionEntity entity) {
    persist(entity);
    return entity;
  }

  /**
   * Updates the status of a transaction by its external ID.
   *
   * @param transactionExternalId the external ID of the transaction
   * @param newStatusId           the new status ID to set
   * @return the number of updated records
   */
  public int updateStatusByExternalId(UUID transactionExternalId, Integer newStatusId) {
    return update("transactionStatusId = ?1 where transactionExternalId = ?2",
        newStatusId, transactionExternalId);
  }

}
