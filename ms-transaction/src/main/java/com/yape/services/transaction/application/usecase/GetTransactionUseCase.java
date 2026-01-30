package com.yape.services.transaction.application.usecase;

import com.yape.services.shared.exception.ErrorCode;
import com.yape.services.shared.exception.ResourceNotFoundException;
import com.yape.services.transaction.application.mapper.GraphqlTransactionMapper;
import com.yape.services.transaction.application.query.TransactionQueryHandler;
import com.yape.services.transaction.application.query.TransactionStatusQueryHandler;
import com.yape.services.transaction.application.query.TransferTypeQueryHandler;
import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.graphql.model.Transaction;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Use case for retrieving a transaction.
 */
@ApplicationScoped
public class GetTransactionUseCase {

  private static final Logger LOGGER = Logger.getLogger(GetTransactionUseCase.class);

  private final TransactionQueryHandler transactionQueryHandler;
  private final TransferTypeQueryHandler transferTypeQueryHandler;
  private final TransactionStatusQueryHandler transactionStatusQueryHandler;
  private final GraphqlTransactionMapper mapper;

  /**
   * Constructor for GetTransactionUseCase.
   *
   * @param transactionQueryHandler       the handler for querying transactions
   * @param transferTypeQueryHandler      the handler for querying transfer types
   * @param transactionStatusQueryHandler the handler for querying transaction statuses
   * @param mapper                        the mapper for converting transaction data
   *
   */
  @Inject
  public GetTransactionUseCase(TransactionQueryHandler transactionQueryHandler,
                               TransferTypeQueryHandler transferTypeQueryHandler,
                               TransactionStatusQueryHandler transactionStatusQueryHandler,
                               GraphqlTransactionMapper mapper) {
    this.transactionQueryHandler = transactionQueryHandler;
    this.transferTypeQueryHandler = transferTypeQueryHandler;
    this.transactionStatusQueryHandler = transactionStatusQueryHandler;
    this.mapper = mapper;
  }

  /**
   * Executes the use case to retrieve a transaction by its external ID.
   *
   * @param transactionExternalId the external ID of the transaction
   * @return the retrieved transaction
   */
  public Transaction execute(String transactionExternalId) {
    LOGGER.infof("Executing GetTransactionUseCase for transaction ID: %s", transactionExternalId);
    UUID externalId = UUID.fromString(transactionExternalId);

    var transaction = transactionQueryHandler.getTransactionByExternalId(externalId)
        .orElseThrow(() -> {
          LOGGER.errorf("Transaction not found with external ID: %s", transactionExternalId);
          return new ResourceNotFoundException(ErrorCode.TRANSACTION_NOT_FOUND,
              "Transaction", transactionExternalId);
        });

    var transferType = getTransferType(transaction.getTransferTypeId());
    var transactionStatus = getTransactionStatus(transaction.getTransactionStatusId());

    return mapper.toGraphqlModel(transaction, transferType, transactionStatus);
  }

  private TransferType getTransferType(int transferTypeId) {
    return transferTypeQueryHandler.getTransferTypeById(transferTypeId)
        .orElseThrow(() -> {
          LOGGER.errorf("Invalid transfer type ID: %d", transferTypeId);
          return new ResourceNotFoundException(ErrorCode.TRANSFER_TYPE_NOT_FOUND,
              "TransferType", String.valueOf(transferTypeId));
        });
  }

  private TransactionStatus getTransactionStatus(int transactionStatusId) {
    return transactionStatusQueryHandler.getTransactionStatusById(transactionStatusId)
        .orElseThrow(() -> {
          LOGGER.errorf("Invalid transaction status ID: %d", transactionStatusId);
          return new ResourceNotFoundException(ErrorCode.TRANSACTION_STATUS_NOT_FOUND,
              "TransactionStatus", String.valueOf(transactionStatusId));
        });
  }

}
