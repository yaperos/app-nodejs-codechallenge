package com.yape.services.transaction.infrastructure.persistence.repository;

import com.yape.services.transaction.infrastructure.persistence.entity.TransactionStatusEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Repository for transaction status entities in PostgreSQL using Panache.
 */
@ApplicationScoped
public class TransactionStatusPostgresRepository
    implements PanacheRepositoryBase<TransactionStatusEntity, Long> {

  /**
   * Finds a transaction status entity by its code.
   *
   * @param code the code of the transaction status
   * @return the transaction status entity
   */
  public TransactionStatusEntity findByCode(String code) {
    return find("code", code).firstResult();
  }

  /**
   * Finds a transaction status entity by its ID.
   *
   * @param id the ID of the transaction status
   * @return the transaction status entity
   */
  public TransactionStatusEntity findById(Integer id) {
    return find("transactionStatusId", id).firstResult();
  }

}
