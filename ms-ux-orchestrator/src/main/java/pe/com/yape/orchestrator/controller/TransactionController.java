package pe.com.yape.orchestrator.controller;

import java.util.UUID;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import pe.com.yape.orchestrator.model.request.CreateTransactionRequest;
import pe.com.yape.orchestrator.model.response.TransactionResponse;
import pe.com.yape.orchestrator.service.TransactionOrchestrationService;
import reactor.core.publisher.Mono;

/**
 * Controlador REST
 * 
 * Endpoints:
 * - POST /transaction - Crear transaccion
 * - GET /transaction/{id} - Obtener transaccion x ID
 * 
 * @author lmarusic
 * @version 1.0.0
 */
@RestController
@RequestMapping("/transaction")
@RequiredArgsConstructor
@Validated
@Slf4j
public class TransactionController {
    
    private final TransactionOrchestrationService orchestrationService;
    
    /**
     * Crea una nueva transaccion
     * 
     * POST /transaction
     * 
     * @param request CreateTransactionRequest
     * @return Mono (201 CREATED)
     */
    @PostMapping
    public Mono<ResponseEntity<TransactionResponse>> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request ) {

        log.info("POST /transaction - Starting createTransaction method");
        return orchestrationService.createTransaction(request)
                .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response))
                .doOnSuccess(response -> log.info("Transaction created: {}",
                        response.getBody().getTransactionExternalId()));
    }
    
    /**
     * Obtiene una transaccion por ID
     * 
     * GET /transaction/{transactionExternalId}
     * 
     * @param transactionExternalId ID de la transaccion
     * @return Mono (200 OK)
     */
    @GetMapping("/{transactionExternalId}")
    public Mono<ResponseEntity<TransactionResponse>> getTransaction(
            @PathVariable UUID transactionExternalId ) {

        log.info("GET /transaction/{} - Retrieving transaction", transactionExternalId);
        return orchestrationService.getTransaction(transactionExternalId)
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> 
                    log.info("Transaction retrieved: {}", transactionExternalId));
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public Mono<ResponseEntity<String>> health() {
        return Mono.just(ResponseEntity.ok("Orchestrator Service is UP"));
    }
}

