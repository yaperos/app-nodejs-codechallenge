package com.tec.transaction.infrastructure;

import com.tec.yape.transaction.YapeTransactionService;
import com.tec.yape.transaction.application.usecase.TransactionUseCase;
import com.tec.yape.transaction.infrastructure.rest.controller.v1.TransactionController;
import com.tec.yape.transaction.infrastructure.rest.dto.response.TransactionResponseDto;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TransactionController.class)
@ContextConfiguration(classes = YapeTransactionService.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionUseCase transactionUseCase;

    @Test
    void shouldCreateTransactionSuccessfully() throws Exception {

        String requestJson = """
        {
          "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
          "accountExternalIdCredit": "660e8400-e29b-41d4-a716-446655440111",
          "tranferTypeId": 1,
          "value": 500
        }
        """;

        Mockito.when(transactionUseCase.registerTransaction(any()))
                .thenReturn(new TransactionResponseDto());

        mockMvc.perform(post("/api/v1/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk());
    }
}
