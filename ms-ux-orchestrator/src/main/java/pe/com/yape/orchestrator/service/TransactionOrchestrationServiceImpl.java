package pe.com.yape.orchestrator.service;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.com.yape.orchestrator.model.request.CreateTransactionRequest;
import pe.com.yape.orchestrator.model.response.TransactionResponse;
import pe.com.yape.orchestrator.service.port.TransactionServicePort;
import reactor.core.publisher.Mono;

/**
 * Implementacion de la clase TransactionOrchestrationService
 * 
 * @author lmarusic
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionOrchestrationServiceImpl implements TransactionOrchestrationService {
    
    private final TransactionServicePort transactionServicePort;
    
    @Override
    public Mono<TransactionResponse> createTransaction(CreateTransactionRequest request) {
        log.info("Orchestrating transaction creation - Debit: {}, Credit: {}, Value: {}",
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit(),
                request.getValue());
        return transactionServicePort.createTransaction(request)
                .doOnSuccess(response -> 
                    log.info("Transaction created successfully: {}", response.getTransactionExternalId()))
                .doOnError(error -> 
                    log.error("Error creating transaction", error));
    }
    
    @Override
    public Mono<TransactionResponse> getTransaction(UUID transactionExternalId) {
        log.info("Orchestrating transaction retrieval: {}", transactionExternalId);
        return transactionServicePort.getTransactionById(transactionExternalId)
                .doOnSuccess(response -> 
                    log.info("Transaction retrieved successfully: {}", transactionExternalId))
                .doOnError(error -> 
                    log.error("Error retrieving transaction: {}", transactionExternalId, error));
    }
}

