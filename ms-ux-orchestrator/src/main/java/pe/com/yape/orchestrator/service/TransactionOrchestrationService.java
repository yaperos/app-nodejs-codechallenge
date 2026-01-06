package pe.com.yape.orchestrator.service;

import java.util.UUID;
import pe.com.yape.orchestrator.model.request.CreateTransactionRequest;
import pe.com.yape.orchestrator.model.response.TransactionResponse;
import reactor.core.publisher.Mono;

/**
 * Servicio de orquestacion de transacciones
 * aca se puede implementar el realizar distintas acciones en base a featureFlags
 * 
 * @author lmarusic
 * @version 1.0.0
 */
public interface TransactionOrchestrationService {
    
    /**
     * Orquesta la creacion de una transaccion
     * 
     * @param request CreateTransactionRequest
     * @return Mono TransactionResponse
     */
    Mono<TransactionResponse> createTransaction(CreateTransactionRequest request);
    
    /**
     * Orquesta la consulta de una transaccion
     * 
     * @param transactionExternalId ID de la transacción
     * @return Mono TransactionResponse
     */
    Mono<TransactionResponse> getTransaction(UUID transactionExternalId);
}

