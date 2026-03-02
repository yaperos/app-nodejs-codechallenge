package com.yape.transaction.infrastructure.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.TestRedisConfig;
import com.yape.transaction.infrastructure.rest.dto.CreateTransactionRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for the TransactionController.
 * Uses Testcontainers for PostgreSQL and Kafka, and a mock Redis configuration
 * to simulate the full application context without requiring a real Redis instance.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
@Import(TestRedisConfig.class)
@DisplayName("TransactionController Integration Tests")
class TransactionControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:15-alpine"))
            .withDatabaseName("transactions_test_db")
            .withUsername("test")
            .withPassword("test");

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // PostgreSQL properties
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);

        // Kafka properties
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);

        // Redis properties (mock will override, but these prevent connection errors during startup)
        registry.add("spring.data.redis.host", () -> "localhost");
        registry.add("spring.data.redis.port", () -> "6379");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /transactions - Should create transaction and return 201 with correct body")
    void shouldCreateTransactionAndReturn201() throws Exception {
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("500.00"))
                .build();

        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionExternalId").isNotEmpty())
                .andExpect(jsonPath("$.transactionStatus.name").value("PENDING"))
                .andExpect(jsonPath("$.transactionType.name").value("TRANSFER"))
                .andExpect(jsonPath("$.value").value(500.00))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());
    }

    @Test
    @DisplayName("POST /transactions - Should create transaction with large value and return 201")
    void shouldCreateTransactionWithLargeValueAndReturn201() throws Exception {
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("99999.99"))
                .build();

        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionExternalId").isNotEmpty())
                .andExpect(jsonPath("$.transactionStatus.name").value("PENDING"))
                .andExpect(jsonPath("$.value").value(99999.99));
    }

    @Test
    @DisplayName("GET /transactions/{id} - Should get transaction and return 200 with correct body")
    void shouldGetTransactionAndReturn200() throws Exception {
        // First, create a transaction
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("200.00"))
                .build();

        String responseBody = mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        // Extract the external ID from the creation response
        String externalId = objectMapper.readTree(responseBody).get("transactionExternalId").asText();

        // Then retrieve it by external ID
        mockMvc.perform(get("/transactions/" + externalId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionExternalId").value(externalId))
                .andExpect(jsonPath("$.transactionStatus.name").value("PENDING"))
                .andExpect(jsonPath("$.transactionType.name").value("TRANSFER"))
                .andExpect(jsonPath("$.value").value(200.00))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());
    }

    @Test
    @DisplayName("GET /transactions/{id} - Should return error for non-existent transaction")
    void shouldReturnErrorForNonExistentTransaction() throws Exception {
        UUID nonExistentId = UUID.randomUUID();

        mockMvc.perform(get("/transactions/" + nonExistentId))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @DisplayName("POST /transactions - Should handle unknown transfer type ID")
    void shouldHandleUnknownTransferTypeId() throws Exception {
        CreateTransactionRequest request = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(99)
                .value(new BigDecimal("100.00"))
                .build();

        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionType.name").value("UNKNOWN"));
    }

    @Test
    @DisplayName("POST /transactions - Should create multiple independent transactions")
    void shouldCreateMultipleIndependentTransactions() throws Exception {
        CreateTransactionRequest request1 = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("100.00"))
                .build();

        CreateTransactionRequest request2 = CreateTransactionRequest.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .tranferTypeId(1)
                .value(new BigDecimal("300.00"))
                .build();

        String response1 = mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String response2 = mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String externalId1 = objectMapper.readTree(response1).get("transactionExternalId").asText();
        String externalId2 = objectMapper.readTree(response2).get("transactionExternalId").asText();

        // Verify each transaction can be retrieved independently
        mockMvc.perform(get("/transactions/" + externalId1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value(100.00));

        mockMvc.perform(get("/transactions/" + externalId2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value(300.00));
    }
}
