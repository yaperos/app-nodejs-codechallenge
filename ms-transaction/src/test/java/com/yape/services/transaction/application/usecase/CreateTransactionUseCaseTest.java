package com.yape.services.transaction.application.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.shared.exception.BusinessException;
import com.yape.services.shared.exception.ResourceNotFoundException;
import com.yape.services.shared.exception.ValidationException;
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
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CreateTransactionUseCaseTest {

  @Mock
  private CreateTransactionCommandHandler commandHandler;
  @Mock
  private TransactionEventPublisher eventPublisher;
  @Mock
  private TransactionMapper transactionMapper;
  @Mock
  private GraphqlTransactionMapper graphqlMapper;
  @Mock
  private TransferTypeQueryHandler transferTypeQueryHandler;
  @Mock
  private TransactionStatusQueryHandler statusQueryHandler;

  @Captor
  private ArgumentCaptor<CreateTransactionCommand> commandCaptor;

  private CreateTransactionUseCase useCase;

  private static final UUID DEBIT_ACCOUNT_ID = UUID.randomUUID();
  private static final UUID CREDIT_ACCOUNT_ID = UUID.randomUUID();
  private static final int TRANSFER_TYPE_ID = 1;
  private static final String VALID_AMOUNT = "100.50";

  @BeforeEach
  void setUp() {
    useCase = new CreateTransactionUseCase(
        commandHandler,
        eventPublisher,
        transactionMapper,
        graphqlMapper,
        transferTypeQueryHandler,
        statusQueryHandler
    );
  }

  @Test
  @DisplayName("should create transaction successfully with valid input")
  void shouldCreateTransactionSuccessfully() {
    // Arrange
    CreateTransaction input = createValidInput();
    RequestMetaData metaData = createMetaData();
    TransferType transferType = createTransferType();
    TransactionStatus pendingStatus = createPendingStatus();
    Transaction savedTransaction = createSavedTransaction();
    TransactionCreatedEvent event = createEvent();
    var expectedGraphqlResponse = createGraphqlTransaction();

    when(transferTypeQueryHandler.getTransferTypeById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(transferType));
    when(statusQueryHandler.getTransactionStatusByCode("PENDING"))
        .thenReturn(Optional.of(pendingStatus));
    when(commandHandler.handle(any(CreateTransactionCommand.class)))
        .thenReturn(savedTransaction);
    when(transactionMapper.toTransactionCreatedEvent(savedTransaction, pendingStatus, metaData))
        .thenReturn(event);
    when(graphqlMapper.toGraphqlModel(savedTransaction, transferType, pendingStatus))
        .thenReturn(expectedGraphqlResponse);

    // Act
    var result = useCase.execute(input, metaData);

    // Assert
    assertEquals(expectedGraphqlResponse, result);
    verify(commandHandler).handle(commandCaptor.capture());
    verify(eventPublisher).publishTransactionCreated(event);

    CreateTransactionCommand capturedCommand = commandCaptor.getValue();
    assertEquals(DEBIT_ACCOUNT_ID, capturedCommand.accountExternalIdDebit());
    assertEquals(CREDIT_ACCOUNT_ID, capturedCommand.accountExternalIdCredit());
    assertEquals(new BigDecimal(VALID_AMOUNT), capturedCommand.value());
  }

  @Test
  @DisplayName("should throw ResourceNotFoundException when transfer type not found")
  void shouldThrowWhenTransferTypeNotFound() {
    // Arrange
    CreateTransaction input = createValidInput();
    RequestMetaData metaData = createMetaData();

    when(transferTypeQueryHandler.getTransferTypeById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(ResourceNotFoundException.class, () -> useCase.execute(input, metaData));

    verify(commandHandler, never()).handle(any());
    verify(eventPublisher, never()).publishTransactionCreated(any());
  }

  @Test
  @DisplayName("should throw BusinessException when PENDING status not configured")
  void shouldThrowWhenPendingStatusNotConfigured() {
    // Arrange
    CreateTransaction input = createValidInput();
    RequestMetaData metaData = createMetaData();
    TransferType transferType = createTransferType();

    when(transferTypeQueryHandler.getTransferTypeById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(transferType));
    when(statusQueryHandler.getTransactionStatusByCode("PENDING"))
        .thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(BusinessException.class, () -> useCase.execute(input, metaData));

    verify(commandHandler, never()).handle(any());
  }

  @ParameterizedTest
  @MethodSource("invalidAmountsProvider")
  @DisplayName("should throw ValidationException for invalid amounts")
  void shouldThrowValidationExceptionForInvalidAmounts(String invalidAmount) {
    // Arrange
    CreateTransaction input = new CreateTransaction();
    input.setAccountExternalIdDebit(DEBIT_ACCOUNT_ID.toString());
    input.setAccountExternalIdCredit(CREDIT_ACCOUNT_ID.toString());
    input.setTransferTypeId(TRANSFER_TYPE_ID);
    input.setValue(invalidAmount);
    RequestMetaData metaData = createMetaData();
    // Act & Assert
    assertThrows(ValidationException.class, () -> useCase.execute(input, metaData));
  }

  static Stream<String> invalidAmountsProvider() {
    return Stream.of(null, "   ", "invalid-amount", "-10.00");
  }

  @Test
  @DisplayName("should throw ValidationException when debit account ID is null")
  void shouldThrowWhenDebitAccountIdIsNull() {
    // Arrange
    CreateTransaction input = new CreateTransaction();
    input.setAccountExternalIdDebit(null);
    input.setAccountExternalIdCredit(CREDIT_ACCOUNT_ID.toString());
    input.setTransferTypeId(TRANSFER_TYPE_ID);
    input.setValue(VALID_AMOUNT);

    RequestMetaData metaData = createMetaData();
    TransferType transferType = createTransferType();
    TransactionStatus pendingStatus = createPendingStatus();

    when(transferTypeQueryHandler.getTransferTypeById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(transferType));
    when(statusQueryHandler.getTransactionStatusByCode("PENDING"))
        .thenReturn(Optional.of(pendingStatus));

    // Act & Assert
    assertThrows(ValidationException.class, () -> useCase.execute(input, metaData));
  }

  @Test
  @DisplayName("should throw ValidationException when debit account ID has invalid UUID format")
  void shouldThrowWhenDebitAccountIdHasInvalidFormat() {
    // Arrange
    CreateTransaction input = new CreateTransaction();
    input.setAccountExternalIdDebit("invalid-uuid");
    input.setAccountExternalIdCredit(CREDIT_ACCOUNT_ID.toString());
    input.setTransferTypeId(TRANSFER_TYPE_ID);
    input.setValue(VALID_AMOUNT);

    RequestMetaData metaData = createMetaData();
    TransferType transferType = createTransferType();
    TransactionStatus pendingStatus = createPendingStatus();

    when(transferTypeQueryHandler.getTransferTypeById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(transferType));
    when(statusQueryHandler.getTransactionStatusByCode("PENDING"))
        .thenReturn(Optional.of(pendingStatus));

    // Act & Assert
    assertThrows(ValidationException.class, () -> useCase.execute(input, metaData));
  }

  private CreateTransaction createValidInput() {
    CreateTransaction input = new CreateTransaction();
    input.setAccountExternalIdDebit(DEBIT_ACCOUNT_ID.toString());
    input.setAccountExternalIdCredit(CREDIT_ACCOUNT_ID.toString());
    input.setTransferTypeId(TRANSFER_TYPE_ID);
    input.setValue(VALID_AMOUNT);
    return input;
  }

  private TransferType createTransferType() {
    return TransferType.builder()
        .transferTypeId(TRANSFER_TYPE_ID)
        .code("TRANSFER")
        .name("Transfer")
        .build();
  }

  private TransactionStatus createPendingStatus() {
    return TransactionStatus.builder()
        .transactionStatusId(1)
        .code("PENDING")
        .name("Pending")
        .build();
  }

  private Transaction createSavedTransaction() {
    return Transaction.builder()
        .transactionExternalId(UUID.randomUUID())
        .accountExternalIdDebit(DEBIT_ACCOUNT_ID)
        .accountExternalIdCredit(CREDIT_ACCOUNT_ID)
        .transferTypeId(TRANSFER_TYPE_ID)
        .transactionStatusId(1)
        .value(new BigDecimal(VALID_AMOUNT))
        .build();
  }

  private TransactionCreatedEvent createEvent() {
    com.yape.services.common.events.EventMetadata metadata =
        com.yape.services.common.events.EventMetadata.newBuilder()
            .setEventId(UUID.randomUUID().toString())
            .setEventType("TRANSACTION_CREATED")
            .setEventTimestamp("2024-01-01T00:00:00.000+0000")
            .setSource("ms-transaction")
            .setVersion("1.0.0")
            .setRequestId("request-123")
            .build();

    com.yape.services.transaction.events.TransactionCreatedPayload payload =
        com.yape.services.transaction.events.TransactionCreatedPayload.newBuilder()
            .setTransactionExternalId(UUID.randomUUID().toString())
            .setAccountExternalIdDebit(DEBIT_ACCOUNT_ID.toString())
            .setAccountExternalIdCredit(CREDIT_ACCOUNT_ID.toString())
            .setTransferTypeId(TRANSFER_TYPE_ID)
            .setValue(VALID_AMOUNT)
            .setStatus(com.yape.services.transaction.events.enums.TransactionStatus.PENDING)
            .setCreatedAt("2024-01-01T00:00:00.000+0000")
            .build();

    return TransactionCreatedEvent.newBuilder()
        .setMetadata(metadata)
        .setPayload(payload)
        .build();
  }

  private com.yape.services.transaction.graphql.model.Transaction createGraphqlTransaction() {
    var tx = new com.yape.services.transaction.graphql.model.Transaction();
    tx.setTransactionExternalId(UUID.randomUUID().toString());
    tx.setValue(VALID_AMOUNT);
    return tx;
  }

  private RequestMetaData createMetaData() {
    return new RequestMetaData("Bearer token", "request-123", "2024-01-01");
  }
}
