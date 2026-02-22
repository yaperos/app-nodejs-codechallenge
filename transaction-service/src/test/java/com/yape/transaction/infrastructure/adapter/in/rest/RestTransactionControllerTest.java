package com.yape.transaction.infrastructure.adapter.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yape.transaction.domain.exception.TransactionNotFoundException;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.port.in.CreateTransactionCommand;
import com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import com.yape.transaction.domain.port.in.GetTransactionUseCase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class RestTransactionControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private StubCreateTransactionUseCase createUseCase;
    private StubGetTransactionUseCase getUseCase;

    @BeforeEach
    void setUp() {
        createUseCase = new StubCreateTransactionUseCase();
        getUseCase = new StubGetTransactionUseCase();
        RestTransactionController controller = new RestTransactionController(createUseCase, getUseCase);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Test
    void shouldCreateTransaction() throws Exception {
        CreateTransactionRequest request = new CreateTransactionRequest(
                UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("500")
        );

        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.transactionExternalId").isNotEmpty())
                .andExpect(jsonPath("$.transactionStatus.name").value("pending"))
                .andExpect(jsonPath("$.transactionType.name").value("transfer"))
                .andExpect(jsonPath("$.value").value(500));
    }

    @Test
    void shouldReturnTransactionById() throws Exception {
        Transaction transaction = Transaction.create(
                UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("200")
        );
        getUseCase.nextTransaction = transaction;

        mockMvc.perform(get("/transactions/{id}", transaction.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionExternalId").isNotEmpty())
                .andExpect(jsonPath("$.value").value(200));
    }

    @Test
    void shouldReturn404WhenTransactionNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        getUseCase.throwNotFound = true;

        mockMvc.perform(get("/transactions/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Transaction not found"));
    }

    @Test
    void shouldReturn400WhenValidationFails() throws Exception {
        String invalidBody = """
                {
                    "accountExternalIdDebit": null,
                    "value": -100
                }
                """;

        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }

    static class StubCreateTransactionUseCase implements CreateTransactionUseCase {
        @Override
        public Transaction execute(CreateTransactionCommand command) {
            return Transaction.create(
                    command.accountExternalIdDebit(),
                    command.accountExternalIdCredit(),
                    command.transferTypeId(),
                    command.value()
            );
        }
    }

    static class StubGetTransactionUseCase implements GetTransactionUseCase {
        Transaction nextTransaction;
        boolean throwNotFound = false;

        @Override
        public Transaction execute(UUID transactionId) {
            if (throwNotFound) throw new TransactionNotFoundException(transactionId);
            if (nextTransaction != null) return nextTransaction;
            return Transaction.create(UUID.randomUUID(), UUID.randomUUID(), 1, new BigDecimal("100"));
        }
    }
}
