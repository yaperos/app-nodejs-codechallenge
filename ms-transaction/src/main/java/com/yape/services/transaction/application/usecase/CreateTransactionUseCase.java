package com.yape.services.transaction.application.usecase;

import com.yape.services.shared.exception.BusinessException;
import com.yape.services.shared.exception.ErrorCode;
import com.yape.services.shared.exception.ResourceNotFoundException;
import com.yape.services.shared.exception.ValidationException;
import com.yape.services.shared.util.Constants;
import com.yape.services.transaction.application.command.CreateTransactionCommand;
import com.yape.services.transaction.application.command.CreateTransactionCommandHandler;
import com.yape.services.transaction.application.dto.RequestMetaData;
import com.yape.services.transaction.application.mapper.GraphqlTransactionMapper;
import com.yape.services.transaction.application.mapper.TransactionMapper;
import com.yape.services.transaction.application.query.TransactionStatusQueryHandler;
import com.yape.services.transaction.application.query.TransferTypeQueryHandler;
import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.domain.service.TransactionEventPublisher;
import com.yape.services.transaction.events.TransactionCreatedEvent;
import com.yape.services.transaction.graphql.model.CreateTransaction;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import org.jboss.logging.Logger;

/**
 * Use case for creating a transaction.
 */
@ApplicationScoped
public class CreateTransactionUseCase {

  private static final BigDecimal MIN_AMOUNT = BigDecimal.valueOf(0.00);
  private static final Logger LOGGER = Logger.getLogger(CreateTransactionUseCase.class);

  private final TransactionEventPublisher transactionEventPublisher;
  private final TransactionMapper transactionMapper;
  private final GraphqlTransactionMapper graphqlTransactionMapper;
  private final CreateTransactionCommandHandler createTransactionCommandHandler;
  private final TransferTypeQueryHandler transferTypeQueryHandler;
  private final TransactionStatusQueryHandler transactionStatusQueryHandler;

  /**
   * Constructor for CreateTransactionUseCase.
   *
   * @param createTransactionCommandHandler the command handler for creating transactions
   * @param transactionEventPublisher       the event publisher for transaction events
   * @param transactionMapper               the mapper for transaction events
   * @param graphqlTransactionMapper        the mapper for GraphQL responses
   * @param transferTypeQueryHandler        the query handler for transfer types
   * @param transactionStatusQueryHandler   the query handler for transaction statuses
   */
  public CreateTransactionUseCase(CreateTransactionCommandHandler createTransactionCommandHandler,
                                  TransactionEventPublisher transactionEventPublisher,
                                  TransactionMapper transactionMapper,
                                  GraphqlTransactionMapper graphqlTransactionMapper,
                                  TransferTypeQueryHandler transferTypeQueryHandler,
                                  TransactionStatusQueryHandler transactionStatusQueryHandler) {
    this.createTransactionCommandHandler = createTransactionCommandHandler;
    this.transactionEventPublisher = transactionEventPublisher;
    this.transactionMapper = transactionMapper;
    this.graphqlTransactionMapper = graphqlTransactionMapper;
    this.transferTypeQueryHandler = transferTypeQueryHandler;
    this.transactionStatusQueryHandler = transactionStatusQueryHandler;
  }

  /**
   * Executes the use case to create a transaction.
   *
   * @param input    the input data for creating a transaction
   * @param metaData the request metadata
   * @return the created transaction details
   */
  public com.yape.services.transaction.graphql.model.Transaction execute(
      @NotNull CreateTransaction input,
      RequestMetaData metaData
  ) {
    BigDecimal value = parseAndValidateAmount(input.getValue());
    TransferType transferType = getTransferType(input.getTransferTypeId());
    TransactionStatus status = getPendingStatus();

    CreateTransactionCommand command = buildCommand(input, transferType, status, value);
    Transaction savedTransaction = createTransactionCommandHandler.handle(command);

    publishTransactionCreatedEvent(savedTransaction, status, metaData);

    return graphqlTransactionMapper.toGraphqlModel(savedTransaction, transferType, status);
  }

  private BigDecimal parseAndValidateAmount(String value) {
    if (value == null || value.isBlank()) {
      LOGGER.error("Transaction value is null or empty");
      throw new ValidationException(ErrorCode.VALIDATION_ERROR,
          "value", "Transaction value is required");
    }

    BigDecimal amount;
    try {
      amount = new BigDecimal(value);
    } catch (NumberFormatException e) {
      LOGGER.errorf("Invalid transaction value format: %s", value);
      throw new ValidationException(ErrorCode.INVALID_FORMAT,
          "value", "Invalid transaction value format");
    }

    if (amount.compareTo(MIN_AMOUNT) < 0) {
      LOGGER.errorf("Transaction value %s is below minimum %s", amount, MIN_AMOUNT);
      throw new ValidationException(ErrorCode.AMOUNT_BELOW_MINIMUM,
          "value", "Transaction value is below the minimum allowed");
    }
    return amount;
  }

  private TransferType getTransferType(int transferTypeId) {
    return transferTypeQueryHandler.getTransferTypeById(transferTypeId)
        .orElseThrow(() -> {
          LOGGER.errorf("Invalid transfer type ID: %d", transferTypeId);
          return new ResourceNotFoundException(ErrorCode.TRANSFER_TYPE_NOT_FOUND,
              "TransferType", String.valueOf(transferTypeId));
        });
  }

  private TransactionStatus getPendingStatus() {
    return transactionStatusQueryHandler
        .getTransactionStatusByCode(Constants.TRANSACTION_STATUS_PENDING)
        .orElseThrow(() -> {
          LOGGER.error("PENDING transaction status not found in database");
          return new BusinessException(ErrorCode.CONFIGURATION_ERROR,
              "PENDING status configuration missing");
        });
  }

  private CreateTransactionCommand buildCommand(CreateTransaction input,
                                                TransferType transferType,
                                                TransactionStatus status,
                                                BigDecimal value) {
    UUID debitAccountId = parseUuid(input.getAccountExternalIdDebit(), "accountExternalIdDebit");
    UUID creditAccountId = parseUuid(input.getAccountExternalIdCredit(), "accountExternalIdCredit");

    return new CreateTransactionCommand(
        debitAccountId,
        creditAccountId,
        transferType.getTransferTypeId(),
        status.getTransactionStatusId(),
        status.getCode(),
        value
    );
  }

  private UUID parseUuid(String value, String fieldName) {
    if (value == null || value.isBlank()) {
      LOGGER.errorf("Field %s is null or empty", fieldName);
      throw new ValidationException(ErrorCode.VALIDATION_ERROR,
          fieldName, fieldName + " is required");
    }

    try {
      return UUID.fromString(value);
    } catch (IllegalArgumentException e) {
      LOGGER.errorf("Invalid UUID format for %s: %s", fieldName, value);
      throw new ValidationException(ErrorCode.INVALID_FORMAT,
          fieldName, "Invalid UUID format for " + fieldName);
    }
  }

  private void publishTransactionCreatedEvent(Transaction transaction,
                                              TransactionStatus status,
                                              RequestMetaData metaData) {
    TransactionCreatedEvent event = transactionMapper
        .toTransactionCreatedEvent(transaction, status, metaData);
    transactionEventPublisher.publishTransactionCreated(event);
  }

}
