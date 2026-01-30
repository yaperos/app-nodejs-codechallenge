package com.yape.services.transaction.application.command;

import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.repository.TransactionRepository;
import com.yape.services.transaction.domain.service.TransactionCacheService;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Command handler for creating a transaction.
 */
@ApplicationScoped
public class CreateTransactionCommandHandler {

  private static final Logger LOGGER = Logger.getLogger(CreateTransactionCommandHandler.class);

  private final TransactionRepository repository;
  private final TransactionCacheService cacheService;

  /**
   * Constructor for CreateTransactionCommandHandler.
   *
   * @param repository   the repository for managing transactions
   * @param cacheService the cache service for transactions
   */
  public CreateTransactionCommandHandler(TransactionRepository repository,
                                         TransactionCacheService cacheService) {
    this.repository = repository;
    this.cacheService = cacheService;
  }

  /**
   * Handles the creation of a transaction.
   *
   * @param command the command containing transaction data
   * @return the created transaction
   */
  public Transaction handle(CreateTransactionCommand command) {
    LOGGER.info("Handling transaction creation command");

    Transaction tx = buildTransaction(command);
    Transaction savedTx = repository.save(tx);
    LOGGER.infof("Transaction created with ID: %s", savedTx.getTransactionExternalId());

    cacheService.saveTransaction(savedTx, command.transactionStatusCode());
    LOGGER.info("Transaction cached successfully");

    return savedTx;
  }

  private Transaction buildTransaction(CreateTransactionCommand command) {
    return Transaction.builder()
        .transactionExternalId(UUID.randomUUID())
        .accountExternalIdDebit(command.accountExternalIdDebit())
        .accountExternalIdCredit(command.accountExternalIdCredit())
        .transferTypeId(command.transferTypeId())
        .transactionStatusId(command.transactionStatusId())
        .value(command.value())
        .build();
  }

}
