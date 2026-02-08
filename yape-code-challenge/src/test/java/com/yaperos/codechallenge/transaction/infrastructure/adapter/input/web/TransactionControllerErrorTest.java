package com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web;

import com.yaperos.codechallenge.transaction.domain.exception.TransactionNotFoundException;
import com.yaperos.codechallenge.transaction.domain.port.input.CreateTransactionUseCase;
import com.yaperos.codechallenge.transaction.domain.port.input.GetTransactionUseCase;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.mapper.TransactionWebMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TransactionController.class)
@Import(com.yaperos.codechallenge.shared.exception.GlobalExceptionHandler.class)
class TransactionControllerErrorTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CreateTransactionUseCase createTransactionUseCase;

    @MockitoBean
    private GetTransactionUseCase getTransactionUseCase;

    @MockitoBean
    private TransactionWebMapper mapper;

    @Test
    void getById_shouldReturn404WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(getTransactionUseCase.getById(any(UUID.class)))
                .thenThrow(new TransactionNotFoundException(id));

        mockMvc.perform(get("/transactions/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    void create_shouldReturn400ForInvalidTransferType() throws Exception {
        String body = """
                {
                    "accountExternalIdDebit": "%s",
                    "accountExternalIdCredit": "%s",
                    "tranferTypeId": 999,
                    "value": 100
                }
                """.formatted(UUID.randomUUID(), UUID.randomUUID());

        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    void create_shouldReturn400ForMalformedBody() throws Exception {
        mockMvc.perform(post("/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{not valid json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Malformed JSON request"));
    }

    @Test
    void getById_shouldReturn400ForInvalidUuid() throws Exception {
        mockMvc.perform(get("/transactions/{id}", "not-a-uuid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

}
