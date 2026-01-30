package com.yape.services.expose.graphql;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.yape.services.transaction.application.dto.RequestMetaData;
import com.yape.services.transaction.application.usecase.CreateTransactionUseCase;
import com.yape.services.transaction.graphql.model.CreateTransaction;
import com.yape.services.transaction.graphql.model.Transaction;
import io.quarkus.vertx.http.runtime.CurrentVertxRequest;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.ext.web.RoutingContext;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MutationResolverImplTest {

  @Mock
  private CreateTransactionUseCase createTransactionUseCase;
  @Mock
  private CurrentVertxRequest currentVertxRequest;
  @Mock
  private RoutingContext routingContext;
  @Mock
  private HttpServerRequest httpServerRequest;

  @Captor
  private ArgumentCaptor<RequestMetaData> metaDataCaptor;

  private MutationResolverImpl resolver;

  @BeforeEach
  void setUp() {
    resolver = new MutationResolverImpl(createTransactionUseCase, currentVertxRequest);
  }

  @Nested
  @DisplayName("createTransaction")
  class CreateTransactionTests {

    @Test
    @DisplayName("should delegate to use case and return created transaction")
    void shouldDelegateToUseCaseAndReturnCreatedTransaction() {
      // Arrange
      CreateTransaction input = createInput();
      Transaction expectedTransaction = createTransaction();

      when(currentVertxRequest.getCurrent()).thenReturn(routingContext);
      when(routingContext.request()).thenReturn(httpServerRequest);
      when(httpServerRequest.getHeader("Authorization")).thenReturn("Bearer token");
      when(httpServerRequest.getHeader("Request-ID")).thenReturn("req-123");
      when(httpServerRequest.getHeader("Request-Date")).thenReturn("2024-01-01");
      when(createTransactionUseCase.execute(eq(input), any(RequestMetaData.class)))
          .thenReturn(expectedTransaction);

      // Act
      Transaction result = resolver.createTransaction(input);

      // Assert
      assertEquals(expectedTransaction, result);
      verify(createTransactionUseCase).execute(eq(input), any(RequestMetaData.class));
    }

    @Test
    @DisplayName("should extract headers and pass as metadata")
    void shouldExtractHeadersAndPassAsMetadata() {
      // Arrange
      CreateTransaction input = createInput();
      Transaction expectedTransaction = createTransaction();

      when(currentVertxRequest.getCurrent()).thenReturn(routingContext);
      when(routingContext.request()).thenReturn(httpServerRequest);
      when(httpServerRequest.getHeader("Authorization")).thenReturn("Bearer my-token");
      when(httpServerRequest.getHeader("Request-ID")).thenReturn("request-456");
      when(httpServerRequest.getHeader("Request-Date")).thenReturn("2024-02-15");
      when(createTransactionUseCase.execute(eq(input), metaDataCaptor.capture()))
          .thenReturn(expectedTransaction);

      // Act
      resolver.createTransaction(input);

      // Assert
      RequestMetaData capturedMetaData = metaDataCaptor.getValue();
      assertEquals("Bearer my-token", capturedMetaData.authorization());
      assertEquals("request-456", capturedMetaData.requestId());
      assertEquals("2024-02-15", capturedMetaData.requestDate());
    }

    @Test
    @DisplayName("should handle missing headers")
    void shouldHandleMissingHeaders() {
      // Arrange
      CreateTransaction input = createInput();
      Transaction expectedTransaction = createTransaction();

      when(currentVertxRequest.getCurrent()).thenReturn(routingContext);
      when(routingContext.request()).thenReturn(httpServerRequest);
      when(httpServerRequest.getHeader("Authorization")).thenReturn(null);
      when(httpServerRequest.getHeader("Request-ID")).thenReturn(null);
      when(httpServerRequest.getHeader("Request-Date")).thenReturn(null);
      when(createTransactionUseCase.execute(eq(input), metaDataCaptor.capture()))
          .thenReturn(expectedTransaction);

      // Act
      Transaction result = resolver.createTransaction(input);

      // Assert
      assertEquals(expectedTransaction, result);
      RequestMetaData capturedMetaData = metaDataCaptor.getValue();
      assertNull(capturedMetaData.authorization());
      assertNull(capturedMetaData.requestId());
      assertNull(capturedMetaData.requestDate());
    }
  }

  private CreateTransaction createInput() {
    CreateTransaction input = new CreateTransaction();
    input.setAccountExternalIdDebit(UUID.randomUUID().toString());
    input.setAccountExternalIdCredit(UUID.randomUUID().toString());
    input.setTransferTypeId(1);
    input.setValue("100.00");
    return input;
  }

  private Transaction createTransaction() {
    Transaction tx = new Transaction();
    tx.setTransactionExternalId(UUID.randomUUID().toString());
    tx.setValue("100.00");
    return tx;
  }
}
