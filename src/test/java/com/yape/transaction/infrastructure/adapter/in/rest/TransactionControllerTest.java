package com.yape.transaction.infrastructure.adapter.in.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.application.port.in.CreateTransactionUseCase;
import com.yape.transaction.application.port.in.GetTransactionUseCase;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TransactionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CreateTransactionUseCase createTransactionUseCase;

    @Mock
    private GetTransactionUseCase getTransactionUseCase;

    @InjectMocks
    private TransactionController transactionController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(transactionController).build();
    }

    @Test
    void createTransaction_ShouldReturnCreatedTransaction() throws Exception {
        // Arrange
        Transaction transaction = Transaction.builder()
                .accountExternalIdDebit(UUID.randomUUID())
                .accountExternalIdCredit(UUID.randomUUID())
                .transferTypeId(1)
                .value(new BigDecimal("500"))
                .build();

        Transaction createdTransaction = Transaction.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(transaction.getAccountExternalIdDebit())
                .accountExternalIdCredit(transaction.getAccountExternalIdCredit())
                .transferTypeId(transaction.getTransferTypeId())
                .value(transaction.getValue())
                .status(TransactionStatus.PENDING)
                .build();

        when(createTransactionUseCase.createTransaction(any(Transaction.class))).thenReturn(createdTransaction);

        // Act & Assert
        mockMvc.perform(post("/api/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transaction)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transactionExternalId").exists())
                .andExpect(jsonPath("$.transactionStatus.name").value("PENDING"));
    }

    @Test
    void getTransaction_ShouldReturnTransaction_WhenExists() throws Exception {
        // Arrange
        UUID transactionId = UUID.randomUUID();
        Transaction transaction = Transaction.builder()
                .transactionExternalId(transactionId)
                .transferTypeId(1)
                .value(new BigDecimal("100"))
                .status(TransactionStatus.APPROVED)
                .build();

        when(getTransactionUseCase.getTransaction(transactionId)).thenReturn(transaction);

        // Act & Assert
        mockMvc.perform(get("/api/transactions/{transactionExternalId}", transactionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionExternalId").value(transactionId.toString()))
                .andExpect(jsonPath("$.transactionStatus.name").value("APPROVED"));
    }
}
