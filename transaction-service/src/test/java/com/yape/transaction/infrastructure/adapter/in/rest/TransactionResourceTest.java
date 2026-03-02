package com.yape.transaction.infrastructure.adapter.in.rest;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@QuarkusTest
@DisplayName("Transaction Resource Integration Tests")
class TransactionResourceTest {

    @InjectMock
    CreateTransactionUseCase createTransactionUseCase;

    @InjectMock
    GetTransactionUseCase getTransactionUseCase;

    @Test
    @DisplayName("Should create transaction successfully")
    void shouldCreateTransactionSuccessfully() {
        // Given
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = createMockTransaction(transactionId, new BigDecimal("500.00"));

        when(createTransactionUseCase.createTransaction(any(), any(), any(), any()))
                .thenReturn(transaction);

        String requestBody = """
            {
                "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
                "accountExternalIdCredit": "550e8400-e29b-41d4-a716-446655440001",
                "tranferTypeId": 1,
                "value": 500.00
            }
            """;

        // When & Then
        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/transactions")
        .then()
            .statusCode(201)
            .body("transactionExternalId", notNullValue())
            .body("transactionStatus.name", equalTo("pending"))
            .body("transactionType.name", equalTo("Transfer"))
            .body("value", equalTo(500.00f));
    }

    @Test
    @DisplayName("Should return 400 for invalid request")
    void shouldReturn400ForInvalidRequest() {
        String invalidRequestBody = """
            {
                "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
                "value": -100
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(invalidRequestBody)
        .when()
            .post("/transactions")
        .then()
            .statusCode(400);
    }

    @Test
    @DisplayName("Should get transaction by ID")
    void shouldGetTransactionById() {
        // Given
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = createMockTransaction(transactionId, new BigDecimal("750.00"));
        transaction.setStatus(TransactionStatus.APPROVED);

        when(getTransactionUseCase.getTransaction(transactionId))
                .thenReturn(Optional.of(transaction));

        // When & Then
        given()
            .pathParam("transactionExternalId", transactionId.toString())
        .when()
            .get("/transactions/{transactionExternalId}")
        .then()
            .statusCode(200)
            .body("transactionExternalId", equalTo(transactionId.toString()))
            .body("transactionStatus.name", equalTo("approved"))
            .body("value", equalTo(750.00f));
    }

    @Test
    @DisplayName("Should return 404 when transaction not found")
    void shouldReturn404WhenTransactionNotFound() {
        // Given
        UUID transactionId = UUID.randomUUID();

        when(getTransactionUseCase.getTransaction(transactionId))
                .thenReturn(Optional.empty());

        // When & Then
        given()
            .pathParam("transactionExternalId", transactionId.toString())
        .when()
            .get("/transactions/{transactionExternalId}")
        .then()
            .statusCode(404)
            .body("message", equalTo("Transaction not found"));
    }

    private Transaction createMockTransaction(UUID id, BigDecimal value) {
        Transaction transaction = new Transaction();
        transaction.setTransactionExternalId(id);
        transaction.setAccountExternalIdDebit(UUID.randomUUID());
        transaction.setAccountExternalIdCredit(UUID.randomUUID());
        transaction.setTransferTypeId(1);
        transaction.setValue(value);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());
        return transaction;
    }
}
