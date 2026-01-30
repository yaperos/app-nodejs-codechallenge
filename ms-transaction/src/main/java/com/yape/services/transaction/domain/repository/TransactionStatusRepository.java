package com.yape.services.transaction.domain.repository;

import com.yape.services.transaction.domain.model.TransactionStatus;
import java.util.Optional;

/**
 * Repository interface for transaction status data operations.
 */
public interface TransactionStatusRepository {

  /**
   * Finds a transaction status by its code.
   *
   * @param code the code of the transaction status
   * @return an Optional containing the transaction status, or empty if not found
   */
  Optional<TransactionStatus> findByCode(String code);

  /**
   * Finds a transaction status by its ID.
   *
   * @param id the ID of the transaction status
   * @return an Optional containing the transaction status, or empty if not found
   */
  Optional<TransactionStatus> findById(Integer id);

}
