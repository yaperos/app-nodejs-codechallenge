package com.yape.services.transaction.application.query;

import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.repository.TransactionStatusRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;
import org.jboss.logging.Logger;

/**
 * Query handler for transaction status related operations.
 */
@ApplicationScoped
public class TransactionStatusQueryHandler {

  private static final Logger LOGGER = Logger.getLogger(TransactionStatusQueryHandler.class);

  private final TransactionStatusRepository transactionStatusRepository;

  /**
   * Constructor for TransactionStatusQueryHandler.
   *
   * @param transactionStatusRepository the repository for transaction status data
   */
  public TransactionStatusQueryHandler(TransactionStatusRepository transactionStatusRepository) {
    this.transactionStatusRepository = transactionStatusRepository;
  }

  /**
   * Retrieves a transaction status by its code.
   *
   * @param code the code of the transaction status
   * @return an Optional containing the transaction status, or empty if not found
   */
  public Optional<TransactionStatus> getTransactionStatusByCode(String code) {
    LOGGER.infof("Fetching transaction status with code: %s", code);
    return transactionStatusRepository.findByCode(code);
  }

  /**
   * Retrieves a transaction status by its ID.
   *
   * @param id the ID of the transaction status
   * @return an Optional containing the transaction status, or empty if not found
   */
  public Optional<TransactionStatus> getTransactionStatusById(Integer id) {
    LOGGER.infof("Fetching transaction status with ID: %d", id);
    return transactionStatusRepository.findById(id);
  }

}
