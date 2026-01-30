package com.yape.services.transaction.application.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.yape.services.shared.exception.ResourceNotFoundException;
import com.yape.services.transaction.application.mapper.GraphqlTransactionMapper;
import com.yape.services.transaction.application.query.TransactionQueryHandler;
import com.yape.services.transaction.application.query.TransactionStatusQueryHandler;
import com.yape.services.transaction.application.query.TransferTypeQueryHandler;
import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.model.TransferType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GetTransactionUseCaseTest {

  @Mock
  private TransactionQueryHandler transactionQueryHandler;
  @Mock
  private TransferTypeQueryHandler transferTypeQueryHandler;
  @Mock
  private TransactionStatusQueryHandler transactionStatusQueryHandler;
  @Mock
  private GraphqlTransactionMapper mapper;

  private GetTransactionUseCase useCase;

  private static final UUID TRANSACTION_EXTERNAL_ID = UUID.randomUUID();
  private static final int TRANSFER_TYPE_ID = 1;
  private static final int TRANSACTION_STATUS_ID = 1;

  @BeforeEach
  void setUp() {
    useCase = new GetTransactionUseCase(
        transactionQueryHandler,
        transferTypeQueryHandler,
        transactionStatusQueryHandler,
        mapper
    );
  }

  @Test
  @DisplayName("should retrieve transaction successfully")
  void shouldRetrieveTransactionSuccessfully() {
    // Arrange
    String externalIdStr = TRANSACTION_EXTERNAL_ID.toString();
    Transaction transaction = createTransaction();
    TransferType transferType = createTransferType();
    TransactionStatus status = createTransactionStatus();
    var expectedResult = createGraphqlTransaction();

    when(transactionQueryHandler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.of(transaction));
    when(transferTypeQueryHandler.getTransferTypeById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(transferType));
    when(transactionStatusQueryHandler.getTransactionStatusById(TRANSACTION_STATUS_ID))
        .thenReturn(Optional.of(status));
    when(mapper.toGraphqlModel(transaction, transferType, status))
        .thenReturn(expectedResult);

    // Act
    var result = useCase.execute(externalIdStr);

    // Assert
    assertEquals(expectedResult, result);
  }

  @Test
  @DisplayName("should throw ResourceNotFoundException when transaction not found")
  void shouldThrowWhenTransactionNotFound() {
    // Arrange
    String externalIdStr = TRANSACTION_EXTERNAL_ID.toString();

    when(transactionQueryHandler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.empty());

    // Act / Assert
    var exception = assertThrows(ResourceNotFoundException.class,
        () -> useCase.execute(externalIdStr));
    var expectedMessage = "Transaction not found with ID: " + TRANSACTION_EXTERNAL_ID;
    assertEquals(expectedMessage, exception.getMessage());
  }

  @Test
  @DisplayName("should throw ResourceNotFoundException when transfer type not found")
  void shouldThrowWhenTransferTypeNotFound() {
    // Arrange
    String externalIdStr = TRANSACTION_EXTERNAL_ID.toString();
    Transaction transaction = createTransaction();

    when(transactionQueryHandler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.of(transaction));
    when(transferTypeQueryHandler.getTransferTypeById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.empty());

    // Act / Assert
    var exception = assertThrows(ResourceNotFoundException.class,
        () -> useCase.execute(externalIdStr));
    var expectedMessage = "TransferType not found with ID: " + TRANSFER_TYPE_ID;
    assertEquals(expectedMessage, exception.getMessage());
  }

  @Test
  @DisplayName("should throw ResourceNotFoundException when transaction status not found")
  void shouldThrowWhenTransactionStatusNotFound() {
    // Arrange
    String externalIdStr = TRANSACTION_EXTERNAL_ID.toString();
    Transaction transaction = createTransaction();
    TransferType transferType = createTransferType();

    when(transactionQueryHandler.getTransactionByExternalId(TRANSACTION_EXTERNAL_ID))
        .thenReturn(Optional.of(transaction));
    when(transferTypeQueryHandler.getTransferTypeById(TRANSFER_TYPE_ID))
        .thenReturn(Optional.of(transferType));
    when(transactionStatusQueryHandler.getTransactionStatusById(TRANSACTION_STATUS_ID))
        .thenReturn(Optional.empty());

    // Act / Assert
    var exception = assertThrows(ResourceNotFoundException.class, () ->
        useCase.execute(externalIdStr));
    var expectedMessage = "TransactionStatus not found with ID: " + TRANSACTION_STATUS_ID;
    assertEquals(expectedMessage, exception.getMessage());
  }

  @Test
  @DisplayName("should throw IllegalArgumentException when UUID format is invalid")
  void shouldThrowWhenUuidFormatIsInvalid() {
    // Arrange
    String invalidUuid = "not-a-valid-uuid";

    // Act / Assert
    assertThrows(IllegalArgumentException.class, () -> useCase.execute(invalidUuid));
  }

  private Transaction createTransaction() {
    return Transaction.builder()
        .transactionExternalId(TRANSACTION_EXTERNAL_ID)
        .accountExternalIdDebit(UUID.randomUUID())
        .accountExternalIdCredit(UUID.randomUUID())
        .transferTypeId(TRANSFER_TYPE_ID)
        .transactionStatusId(TRANSACTION_STATUS_ID)
        .value(new BigDecimal("100.00"))
        .createdAt(LocalDateTime.now())
        .build();
  }

  private TransferType createTransferType() {
    return TransferType.builder()
        .transferTypeId(TRANSFER_TYPE_ID)
        .code("TRANSFER")
        .name("Transfer")
        .build();
  }

  private TransactionStatus createTransactionStatus() {
    return TransactionStatus.builder()
        .transactionStatusId(TRANSACTION_STATUS_ID)
        .code("PENDING")
        .name("Pending")
        .build();
  }

  private com.yape.services.transaction.graphql.model.Transaction createGraphqlTransaction() {
    var tx = new com.yape.services.transaction.graphql.model.Transaction();
    tx.setTransactionExternalId(TRANSACTION_EXTERNAL_ID.toString());
    tx.setValue("100.00");
    return tx;
  }
}
