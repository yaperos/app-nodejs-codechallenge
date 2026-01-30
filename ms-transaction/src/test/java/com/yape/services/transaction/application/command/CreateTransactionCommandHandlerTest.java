package com.yape.services.transaction.application.command;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.repository.TransactionRepository;
import com.yape.services.transaction.domain.service.TransactionCacheService;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("CreateTransactionCommandHandler")
class CreateTransactionCommandHandlerTest {

  @Mock
  private TransactionRepository repository;
  @Mock
  private TransactionCacheService cacheService;

  @Captor
  private ArgumentCaptor<Transaction> transactionCaptor;

  private CreateTransactionCommandHandler handler;

  private static final UUID DEBIT_ACCOUNT_ID = UUID.randomUUID();
  private static final UUID CREDIT_ACCOUNT_ID = UUID.randomUUID();
  private static final int TRANSFER_TYPE_ID = 1;
  private static final int TRANSACTION_STATUS_ID = 1;
  private static final String STATUS_CODE = "PENDING";
  private static final BigDecimal VALUE = new BigDecimal("150.75");

  @BeforeEach
  void setUp() {
    handler = new CreateTransactionCommandHandler(repository, cacheService);
  }

  @Test
  @DisplayName("should create transaction and save to repository")
  void shouldCreateTransactionAndSaveToRepository() {
    // Arrange
    CreateTransactionCommand command = createCommand();
    Transaction savedTransaction = createSavedTransaction();

    when(repository.save(any(Transaction.class))).thenReturn(savedTransaction);

    // Act
    Transaction result = handler.handle(command);

    // Assert
    assertEquals(savedTransaction, result);
    verify(repository).save(transactionCaptor.capture());

    Transaction capturedTransaction = transactionCaptor.getValue();
    assertEquals(DEBIT_ACCOUNT_ID, capturedTransaction.getAccountExternalIdDebit());
    assertEquals(CREDIT_ACCOUNT_ID, capturedTransaction.getAccountExternalIdCredit());
    assertEquals(TRANSFER_TYPE_ID, capturedTransaction.getTransferTypeId());
    assertEquals(TRANSACTION_STATUS_ID, capturedTransaction.getTransactionStatusId());
    assertEquals(0, capturedTransaction.getValue().compareTo(VALUE));
    assertNotNull(capturedTransaction.getTransactionExternalId());
  }

  @Test
  @DisplayName("should cache transaction after saving")
  void shouldCacheTransactionAfterSaving() {
    // Arrange
    CreateTransactionCommand command = createCommand();
    Transaction savedTransaction = createSavedTransaction();

    when(repository.save(any(Transaction.class))).thenReturn(savedTransaction);

    // Act
    handler.handle(command);

    // Assert
    verify(cacheService).saveTransaction(savedTransaction, STATUS_CODE);
  }

  @Test
  @DisplayName("should generate unique transaction external ID")
  void shouldGenerateUniqueTransactionExternalId() {
    // Arrange
    CreateTransactionCommand command = createCommand();
    Transaction savedTransaction = createSavedTransaction();

    when(repository.save(any(Transaction.class))).thenReturn(savedTransaction);

    // Act
    handler.handle(command);

    // Assert
    verify(repository).save(transactionCaptor.capture());
    Transaction capturedTransaction = transactionCaptor.getValue();
    assertNotNull(capturedTransaction.getTransactionExternalId());
  }

  @Test
  @DisplayName("should return saved transaction from repository")
  void shouldReturnSavedTransactionFromRepository() {
    // Arrange
    CreateTransactionCommand command = createCommand();
    Transaction savedTransaction = createSavedTransaction();
    UUID expectedExternalId = savedTransaction.getTransactionExternalId();

    when(repository.save(any(Transaction.class))).thenReturn(savedTransaction);

    // Act
    Transaction result = handler.handle(command);

    // Assert
    assertEquals(expectedExternalId, result.getTransactionExternalId());
    assertEquals(0, result.getValue().compareTo(VALUE));
  }

  private CreateTransactionCommand createCommand() {
    return new CreateTransactionCommand(
        DEBIT_ACCOUNT_ID,
        CREDIT_ACCOUNT_ID,
        TRANSFER_TYPE_ID,
        TRANSACTION_STATUS_ID,
        STATUS_CODE,
        VALUE
    );
  }

  private Transaction createSavedTransaction() {
    return Transaction.builder()
        .transactionExternalId(UUID.randomUUID())
        .accountExternalIdDebit(DEBIT_ACCOUNT_ID)
        .accountExternalIdCredit(CREDIT_ACCOUNT_ID)
        .transferTypeId(TRANSFER_TYPE_ID)
        .transactionStatusId(TRANSACTION_STATUS_ID)
        .value(VALUE)
        .build();
  }
}
