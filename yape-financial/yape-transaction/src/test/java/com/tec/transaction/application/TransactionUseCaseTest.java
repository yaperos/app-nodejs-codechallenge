package com.tec.transaction.application;

import com.tec.yape.transaction.application.mapper.TransactionUseCaseMapper;
import com.tec.yape.transaction.application.usecase.TransactionUseCase;
import com.tec.yape.transaction.domain.enums.TransactionStatus;
import com.tec.yape.transaction.domain.model.TransactionRequest;
import com.tec.yape.transaction.domain.model.TransactionResponse;
import com.tec.yape.transaction.domain.port.output.TransactionEventPublisherOutPort;
import com.tec.yape.transaction.domain.port.output.TransactionOutPort;
import com.tec.yape.transaction.infrastructure.rest.dto.request.TransactionRequestDto;
import com.tec.yape.transaction.infrastructure.rest.dto.response.TransactionResponseDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionUseCaseTest {

    @Mock
    private TransactionOutPort transactionOutPort;

    @Mock
    private TransactionEventPublisherOutPort eventPublisher;

    @InjectMocks
    private TransactionUseCase useCase;

    @Test
    void shouldCreateTransactionWithPendingStatus() {

        TransactionRequestDto request = new TransactionRequestDto();
        request.setValue(new BigDecimal("500"));


        when(transactionOutPort.create(any(TransactionRequest.class)))
                .thenReturn(transactionResponse());

        TransactionResponseDto response = useCase.registerTransaction(request);

        assertEquals(TransactionStatus.PENDIENTE.name(), response.getTransactionStatus().name());
        verify(eventPublisher).publish(any());
    }


    private TransactionResponse transactionResponse() {
        UUID transactionId = UUID.fromString("231111ef-5c32-4294-bf0a-18ff2193fa90");
        UUID debitId = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        UUID creditId = UUID.fromString("660e8400-e29b-41d4-a716-446655440111");

        TransactionResponse transactionResponse = new TransactionResponse();
        transactionResponse.setId(UUID.randomUUID());
        transactionResponse.setTransactionExternalId(transactionId);
        transactionResponse.setAccountExternalIdCredit(debitId);
        transactionResponse.setAccountExternalIdDebit(creditId);
        transactionResponse.setValue(new BigDecimal("500"));
        transactionResponse.setTransactionStatus(TransactionStatus.PENDIENTE);
        return transactionResponse;
    }


}
