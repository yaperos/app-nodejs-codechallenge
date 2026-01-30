package com.yape.services.transaction.application.usecase;

import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.repository.TransactionRepository;
import com.yape.services.transaction.domain.repository.TransactionStatusRepository;
import com.yape.services.transaction.domain.service.TransactionCacheService;
import com.yape.services.transaction.events.TransactionStatusUpdatedEvent;
import com.yape.services.transaction.events.TransactionStatusUpdatedPayload;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Use case for updating a transaction status based on anti-fraud validation results.
 * Updates both PostgreSQL and Redis cache.
 */
@ApplicationScoped
public class UpdateTransactionStatusUseCase {

  private static final Logger LOGGER = Logger.getLogger(UpdateTransactionStatusUseCase.class);

  private final TransactionRepository transactionRepository;
  private final TransactionStatusRepository transactionStatusRepository;
  private final TransactionCacheService transactionCacheService;

  /**
   * Constructor for UpdateTransactionStatusUseCase.
   *
   * @param transactionRepository       repository for transaction persistence
   * @param transactionStatusRepository repository for transaction status lookup
   * @param transactionCacheService     service for cache operations
   */
  @Inject
  public UpdateTransactionStatusUseCase(TransactionRepository transactionRepository,
                                        TransactionStatusRepository transactionStatusRepository,
                                        TransactionCacheService transactionCacheService) {
    this.transactionRepository = transactionRepository;
    this.transactionStatusRepository = transactionStatusRepository;
    this.transactionCacheService = transactionCacheService;
  }

  /**
   * Executes the transaction status update.
   *
   * @param event the transaction status updated event from anti-fraud service
   */
  @Transactional
  public void execute(TransactionStatusUpdatedEvent event) {
    TransactionStatusUpdatedPayload payload = event.getPayload();
    String transactionExternalIdStr = payload.getTransactionExternalId();
    UUID transactionExternalId = UUID.fromString(transactionExternalIdStr);
    String newStatusCode = payload.getNewStatus().name();

    LOGGER.infof("Processing status update for transaction: %s, new status: %s",
        transactionExternalIdStr, newStatusCode);

    TransactionStatus newStatus = transactionStatusRepository.findByCode(newStatusCode)
        .orElseThrow(() -> {
          LOGGER.errorf("Transaction status not found for code: %s", newStatusCode);
          return new IllegalStateException("Transaction status not found: " + newStatusCode);
        });

    var updatedRows = transactionRepository.updateStatus(transactionExternalId,
        newStatus.getTransactionStatusId());

    if (updatedRows == 0) {
      LOGGER.warnf("No transaction found to update with external ID: %s", transactionExternalIdStr);
      return;
    }

    LOGGER.infof("Transaction %s status updated in database to: %s",
        transactionExternalIdStr, newStatusCode);

    transactionCacheService.updateTransactionStatus(
        transactionExternalId,
        newStatus.getTransactionStatusId(),
        newStatusCode
    );

    LOGGER.infof("Transaction %s status updated in cache to: %s",
        transactionExternalIdStr, newStatusCode);
  }

}
