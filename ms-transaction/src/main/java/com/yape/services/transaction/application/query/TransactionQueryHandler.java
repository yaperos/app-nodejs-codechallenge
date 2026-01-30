package com.yape.services.transaction.application.query;

import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.repository.TransactionRepository;
import com.yape.services.transaction.domain.repository.TransactionStatusRepository;
import com.yape.services.transaction.domain.service.TransactionCacheService;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Query handler for transaction related operations.
 */
@ApplicationScoped
public class TransactionQueryHandler {

  private static final Logger LOGGER = Logger.getLogger(TransactionQueryHandler.class);

  private final TransactionRepository transactionRepository;
  private final TransactionStatusRepository transactionStatusRepository;
  private final TransactionCacheService cacheService;

  /**
   * Constructor for TransactionQueryHandler.
   *
   * @param transactionRepository       the repository for transaction data
   * @param transactionStatusRepository the repository for transaction status data
   * @param cacheService                the cache service for transactions
   */
  public TransactionQueryHandler(TransactionRepository transactionRepository,
                                 TransactionStatusRepository transactionStatusRepository,
                                 TransactionCacheService cacheService) {
    this.transactionRepository = transactionRepository;
    this.transactionStatusRepository = transactionStatusRepository;
    this.cacheService = cacheService;
  }

  /**
   * Retrieves a transaction by its external ID.
   * Implements cache-aside pattern: check cache first, if miss read from DB and populate cache.
   *
   * @param externalId the external ID of the transaction
   * @return an Optional containing the transaction, or empty if not found
   */
  public Optional<Transaction> getTransactionByExternalId(UUID externalId) {
    LOGGER.infof("Fetching transaction with external ID: %s", externalId);

    Optional<Transaction> cachedTransaction = cacheService.getTransactionByExternalId(externalId);
    if (cachedTransaction.isPresent()) {
      return cachedTransaction;
    }

    LOGGER.info("Cache miss - reading from database");
    Optional<Transaction> transaction = transactionRepository.findByExternalId(externalId);

    transaction.ifPresent(this::cacheTransactionWithStatus);

    return transaction;
  }

  /**
   * Caches a transaction with the appropriate TTL based on its status.
   *
   * @param transaction the transaction to cache
   */
  private void cacheTransactionWithStatus(Transaction transaction) {
    transactionStatusRepository.findById(transaction.getTransactionStatusId())
        .ifPresentOrElse(
            status -> {
              cacheService.saveTransaction(transaction, status.getCode());
              LOGGER.infof("Transaction cached with status: %s", status.getCode());
            },
            () -> LOGGER.warnf("Could not cache transaction - status not found for ID: %d",
                transaction.getTransactionStatusId())
        );
  }

}
