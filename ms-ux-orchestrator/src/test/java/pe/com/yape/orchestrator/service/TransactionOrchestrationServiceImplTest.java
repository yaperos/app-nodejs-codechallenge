package pe.com.yape.orchestrator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.com.yape.orchestrator.application.exception.TransactionServiceException;
import pe.com.yape.orchestrator.model.request.CreateTransactionRequest;
import pe.com.yape.orchestrator.model.response.TransactionResponse;
import pe.com.yape.orchestrator.service.port.TransactionServicePort;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

/**
 * Test unitario para TransactionOrchestrationServiceImpl
 * @author lmarusic
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Transaction Orchestration Service Tests")
class TransactionOrchestrationServiceImplTest {

    @Mock
    private TransactionServicePort transactionServicePort;

    @InjectMocks
    private TransactionOrchestrationServiceImpl orchestrationService;

    private CreateTransactionRequest createRequest;
    private TransactionResponse transactionResponse;
    private UUID transactionId;

    @BeforeEach
    void setUp() {
        transactionId = UUID.randomUUID();
        
        createRequest = CreateTransactionRequest.builder()
            .accountExternalIdDebit(UUID.randomUUID())
            .accountExternalIdCredit(UUID.randomUUID())
            .tranferTypeId(1)
            .value(new BigDecimal("100.50"))
            .build();

        transactionResponse = TransactionResponse.builder()
            .transactionExternalId(transactionId)
            .value(new BigDecimal("100.50"))
            .createdAt(LocalDateTime.now())
            .transactionType(TransactionResponse.TransactionTypeDto.builder()
                .name("Transfer")
                .build())
            .transactionStatus(TransactionResponse.TransactionStatusDto.builder()
                .name("PENDING")
                .build())
            .build();
    }

    @Test
    @DisplayName("Should create transaction successfully")
    void shouldCreateTransactionSuccessfully() {
        when(transactionServicePort.createTransaction(any(CreateTransactionRequest.class)))
            .thenReturn(Mono.just(transactionResponse));

        Mono<TransactionResponse> result = orchestrationService.createTransaction(createRequest);

        StepVerifier.create(result)
            .assertNext(response -> {
                assertNotNull(response);
                assertEquals(transactionId, response.getTransactionExternalId());
                assertEquals(new BigDecimal("100.50"), response.getValue());
                assertEquals("PENDING", response.getTransactionStatus().getName());
            })
            .verifyComplete();

        verify(transactionServicePort).createTransaction(createRequest);
    }

    @Test
    @DisplayName("Should handle error when creating transaction")
    void shouldHandleErrorWhenCreatingTransaction() {
        TransactionServiceException exception = 
            new TransactionServiceException("Service unavailable");
        
        when(transactionServicePort.createTransaction(any(CreateTransactionRequest.class)))
            .thenReturn(Mono.error(exception));

        Mono<TransactionResponse> result = orchestrationService.createTransaction(createRequest);

        StepVerifier.create(result)
            .expectErrorMatches(throwable -> 
                throwable instanceof TransactionServiceException &&
                throwable.getMessage().equals("Service unavailable"))
            .verify();

        verify(transactionServicePort).createTransaction(createRequest);
    }

    @Test
    @DisplayName("Should get transaction successfully")
    void shouldGetTransactionSuccessfully() {
        when(transactionServicePort.getTransactionById(transactionId))
            .thenReturn(Mono.just(transactionResponse));

        Mono<TransactionResponse> result = orchestrationService.getTransaction(transactionId);

        StepVerifier.create(result)
            .assertNext(response -> {
                assertNotNull(response);
                assertEquals(transactionId, response.getTransactionExternalId());
                assertEquals(new BigDecimal("100.50"), response.getValue());
            })
            .verifyComplete();

        verify(transactionServicePort).getTransactionById(transactionId);
    }

    @Test
    @DisplayName("Should handle error when getting transaction")
    void shouldHandleErrorWhenGettingTransaction() {
        TransactionServiceException exception = 
            new TransactionServiceException("Transaction not found");
        
        when(transactionServicePort.getTransactionById(transactionId))
            .thenReturn(Mono.error(exception));

        Mono<TransactionResponse> result = orchestrationService.getTransaction(transactionId);

        StepVerifier.create(result)
            .expectErrorMatches(throwable -> 
                throwable instanceof TransactionServiceException &&
                throwable.getMessage().equals("Transaction not found"))
            .verify();

        verify(transactionServicePort).getTransactionById(transactionId);
    }

}

