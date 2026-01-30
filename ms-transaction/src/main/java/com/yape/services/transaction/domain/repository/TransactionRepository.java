package com.yape.services.transaction.domain.repository;

import com.yape.services.transaction.domain.model.Transaction;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing transactions.
 */
public interface TransactionRepository {

  /**
   * Saves a transaction to the repository.
   *
   * @param tx the transaction to save
   * @return the saved transaction
   */
  Transaction save(Transaction tx);

  /**
   * Finds a transaction by its external ID.
   *
   * @param externalId the external ID of the transaction
   * @return an Optional containing the found transaction, or empty if not found
   */
  Optional<Transaction> findByExternalId(UUID externalId);

  /**
   * Updates the status of a transaction.
   *
   * @param externalId  the external ID of the transaction
   * @param newStatusId the new status ID to set
   * @return the number of updated records
   */
  int updateStatus(UUID externalId, Integer newStatusId);

}
