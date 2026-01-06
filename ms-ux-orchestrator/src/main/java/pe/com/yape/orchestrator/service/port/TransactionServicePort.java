package pe.com.yape.orchestrator.service.port;

import java.util.UUID;
import pe.com.yape.orchestrator.model.request.CreateTransactionRequest;
import pe.com.yape.orchestrator.model.response.TransactionResponse;
import reactor.core.publisher.Mono;

/**
 * Puerto de salida para comunicacion con el microservicio de transacciones
 * 
 * @author lmarusic
 * @version 1.0.0
 */
public interface TransactionServicePort {
    
    /**
     * Crea una nueva transaccion en el ms de transacciones
     * 
     * @param request CreateTransactionRequest
     * @return Mono TransactionResponse
     */
    Mono<TransactionResponse> createTransaction(CreateTransactionRequest request);
    
    /**
     * Obtiene una transaccion x ID
     * 
     * @param transactionExternalId ID unico de la transaccion
     * @return Mono TransactionResponse
     */
    Mono<TransactionResponse> getTransactionById(UUID transactionExternalId);
}

