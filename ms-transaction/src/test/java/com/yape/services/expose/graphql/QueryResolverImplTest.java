package com.yape.services.expose.graphql;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.application.usecase.GetTransactionUseCase;
import com.yape.services.transaction.application.usecase.GetTransferTypesUseCase;
import com.yape.services.transaction.graphql.model.Transaction;
import com.yape.services.transaction.graphql.model.TransferType;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class QueryResolverImplTest {

  @Mock
  private GetTransferTypesUseCase getTransferTypesUseCase;
  @Mock
  private GetTransactionUseCase getTransactionUseCase;

  private QueryResolverImpl resolver;

  private static final String TRANSACTION_EXTERNAL_ID = UUID.randomUUID().toString();

  @BeforeEach
  void setUp() {
    resolver = new QueryResolverImpl(getTransferTypesUseCase, getTransactionUseCase);
  }

  @Nested
  @DisplayName("transaction")
  class TransactionQueryTests {

    @Test
    @DisplayName("should delegate to use case and return transaction")
    void shouldDelegateToUseCaseAndReturnTransaction() {
      // Arrange
      Transaction expectedTransaction = createTransaction();
      when(getTransactionUseCase.execute(TRANSACTION_EXTERNAL_ID))
          .thenReturn(expectedTransaction);

      // Act
      Transaction result = resolver.transaction(TRANSACTION_EXTERNAL_ID);

      // Assert
      assertEquals(expectedTransaction, result);
      verify(getTransactionUseCase).execute(TRANSACTION_EXTERNAL_ID);
    }

    @Test
    @DisplayName("should pass transaction ID to use case")
    void shouldPassTransactionIdToUseCase() {
      // Arrange
      String specificId = "specific-transaction-id";
      Transaction expectedTransaction = createTransaction();
      when(getTransactionUseCase.execute(specificId))
          .thenReturn(expectedTransaction);

      // Act
      resolver.transaction(specificId);

      // Assert
      verify(getTransactionUseCase).execute(specificId);
    }
  }

  @Nested
  @DisplayName("transferTypes")
  class TransferTypesQueryTests {

    @Test
    @DisplayName("should delegate to use case and return transfer types")
    void shouldDelegateToUseCaseAndReturnTransferTypes() {
      // Arrange
      List<TransferType> expectedTypes = List.of(
          createTransferType(1, "INTERNAL"),
          createTransferType(2, "EXTERNAL")
      );
      when(getTransferTypesUseCase.execute()).thenReturn(expectedTypes);

      // Act
      List<TransferType> result = resolver.transferTypes();

      // Assert
      assertEquals(2, result.size());
      assertEquals(expectedTypes, result);
      verify(getTransferTypesUseCase).execute();
    }

    @Test
    @DisplayName("should return empty list when no transfer types exist")
    void shouldReturnEmptyListWhenNoTransferTypesExist() {
      // Arrange
      when(getTransferTypesUseCase.execute()).thenReturn(List.of());

      // Act
      List<TransferType> result = resolver.transferTypes();

      // Assert
      assertTrue(result.isEmpty());
    }
  }

  private Transaction createTransaction() {
    Transaction tx = new Transaction();
    tx.setTransactionExternalId(TRANSACTION_EXTERNAL_ID);
    tx.setValue("100.00");
    return tx;
  }

  private TransferType createTransferType(int id, String name) {
    TransferType type = new TransferType();
    type.setTransferTypeId(String.valueOf(id));
    type.setName(name);
    return type;
  }
}
