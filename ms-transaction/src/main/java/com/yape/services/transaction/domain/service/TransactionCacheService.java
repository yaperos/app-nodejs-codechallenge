package com.yape.services.transaction.domain.service;

import com.yape.services.transaction.domain.model.Transaction;
import java.util.Optional;
import java.util.UUID;

/**
 * Service interface for managing transaction cache operations.
 */
public interface TransactionCacheService {

  /**
   * Save a transaction to the cache.
   *
   * @param transaction           The transaction to save.
   * @param statusCode The status code of the transaction.
   */
  void saveTransaction(Transaction transaction, String statusCode);

  /**
   * Retrieve a transaction from the cache by its ID.
   *
   * @param externalId The ID of the transaction to retrieve.
   * @return An Optional containing the Transaction if found, or empty if not found.
   */
  Optional<Transaction> getTransactionByExternalId(UUID externalId);

  /**
   * Update the status of a transaction in the cache.
   *
   * @param externalId The external ID of the transaction to update.
   * @param newStatusId           The new status ID to set for the transaction.
   * @param newStatusCode         The new status to set for the transaction.
   */
  void updateTransactionStatus(UUID externalId,
                               Integer newStatusId,
                               String newStatusCode);

}
