package pe.com.yape.orchestrator.service.adapter;

import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.TimeoutException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import pe.com.yape.orchestrator.application.exception.TransactionServiceException;
import pe.com.yape.orchestrator.model.request.CreateTransactionRequest;
import pe.com.yape.orchestrator.model.response.TransactionResponse;
import pe.com.yape.orchestrator.service.port.TransactionServicePort;
import reactor.core.publisher.Mono;

/**
 * WebClient para comunicacion con transaction-service
 * 
 * @author lmarusic
 * @version 1.0.0
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceWebClientAdapter implements TransactionServicePort {
    
    private final WebClient transactionServiceWebClient;
    
    @Value("${services.transaction.timeout:5000}")
    private long timeout;
    
    @Override
    public Mono<TransactionResponse> createTransaction(CreateTransactionRequest request) {

        log.debug("Calling transaction-service to create transaction");
        return transactionServiceWebClient
                .post()
                .uri("/v1/transactions")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                    status -> status.is4xxClientError() || status.is5xxServerError(),
                    clientResponse -> clientResponse.bodyToMono(String.class)
                        .flatMap(errorBody -> {
                            log.error("Error from transaction-service: {}", errorBody);
                            return Mono.error(new TransactionServiceException(
                                "Error creating transaction: " + errorBody));
                        })
                )
                .bodyToMono(TransactionResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .doOnError(error -> 
                    log.error("Failed to create transaction in transaction-service", error));
    }
    
    @Override
    public Mono<TransactionResponse> getTransactionById(UUID transactionExternalId) {

        log.debug("Calling transaction-service to get transaction: {}", transactionExternalId);
        return transactionServiceWebClient
                .get()
                .uri("/v1/transactions/{id}", transactionExternalId)
                .retrieve()
                .onStatus(
                    status -> status.value() == 404,
                    clientResponse -> {
                        log.info("Transaction not found: {}", transactionExternalId);
                        return Mono.error(new pe.com.yape.orchestrator.application.exception.TransactionNotFoundException(
                            transactionExternalId));
                    }
                )
                .onStatus(
                    status -> status.is4xxClientError() || status.is5xxServerError(),
                    clientResponse -> clientResponse.bodyToMono(String.class)
                        .flatMap(errorBody -> {
                            log.error("Error from transaction-service: {}", errorBody);
                            return Mono.error(new TransactionServiceException(
                                "Error communicating with transaction service: " + errorBody));
                        })
                )
                .bodyToMono(TransactionResponse.class)
                .timeout(Duration.ofMillis(timeout))
                .doOnError(TimeoutException.class, error ->
                    log.error("Timeout getting transaction from transaction-service: {}", 
                        transactionExternalId))
                .doOnError(TransactionServiceException.class, error -> 
                    log.error("Failed to get transaction from transaction-service: {}", 
                        transactionExternalId));
    }
}

