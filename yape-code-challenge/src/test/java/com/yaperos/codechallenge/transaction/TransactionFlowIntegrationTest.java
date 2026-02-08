package com.yaperos.codechallenge.transaction;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yaperos.codechallenge.transaction.domain.model.TransactionStatus;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.dto.CreateTransactionRequest;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.dto.TransactionResponse;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.output.persistence.repository.SpringDataTransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1, topics = {"transaction-created", "transaction-status", "transaction-created.DLT", "transaction-status.DLT"})
@ActiveProfiles("test")
class TransactionFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SpringDataTransactionRepository repository;

    @Test
    void shouldCreateTransactionAndApproveViaKafka() throws Exception {
        CreateTransactionRequest request = new CreateTransactionRequest(
                UUID.randomUUID(),
                UUID.randomUUID(),
                1,
                new BigDecimal("120")
        );

        MvcResult result = mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionExternalId").exists())
                .andExpect(jsonPath("$.transactionStatus.name").value("pending"))
                .andExpect(jsonPath("$.value").value(120))
                .andReturn();

        TransactionResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(), TransactionResponse.class);
        UUID transactionId = response.getTransactionExternalId();
        assertNotNull(transactionId);

        // Wait for Kafka to process the transaction through anti-fraud and back
        await().atMost(10, TimeUnit.SECONDS).untilAsserted(() -> {
            var entity = repository.findById(transactionId).orElseThrow();
            assertEquals(TransactionStatus.APPROVED, entity.getStatus());
        });

        // Verify via GET endpoint
        mockMvc.perform(get("/transactions/{id}", transactionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionStatus.name").value("approved"));
    }

    @Test
    void shouldCreateTransactionAndRejectViaKafka() throws Exception {
        CreateTransactionRequest request = new CreateTransactionRequest(
                UUID.randomUUID(),
                UUID.randomUUID(),
                1,
                new BigDecimal("1500")
        );

        MvcResult result = mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionStatus.name").value("pending"))
                .andReturn();

        TransactionResponse response = objectMapper.readValue(
                result.getResponse().getContentAsString(), TransactionResponse.class);
        UUID transactionId = response.getTransactionExternalId();

        // Wait for Kafka to process the transaction through anti-fraud and back
        await().atMost(10, TimeUnit.SECONDS).untilAsserted(() -> {
            var entity = repository.findById(transactionId).orElseThrow();
            assertEquals(TransactionStatus.REJECTED, entity.getStatus());
        });

        // Verify via GET endpoint
        mockMvc.perform(get("/transactions/{id}", transactionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionStatus.name").value("rejected"));
    }

}
