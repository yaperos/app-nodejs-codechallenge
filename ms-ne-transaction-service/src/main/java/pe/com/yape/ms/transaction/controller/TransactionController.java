package pe.com.yape.ms.transaction.controller;

import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.com.yape.ms.transaction.controller.dto.CreateTransactionRequest;
import pe.com.yape.ms.transaction.controller.dto.TransactionResponse;
import pe.com.yape.ms.transaction.controller.mapper.TransactionMapper;
import pe.com.yape.ms.transaction.model.domain.Transaction;
import pe.com.yape.ms.transaction.service.CreateTransactionUseCase;
import pe.com.yape.ms.transaction.service.GetTransactionUseCase;

/**
 * Controlador REST
 * 
 * @author lmarusic
 * @version 1.0.0
 */
@RestController
@RequestMapping("/v1/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {
    
    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;
    private final TransactionMapper transactionMapper;
    
    /**
     * Crea la transaccion
     * POST /v1/transactions
     * 
     * @param request CreateTransactionRequest
     * @return TransactionResponse (201 CREATED)
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request ) {
        log.info("Starting POST /v1/transactions - createTransaction method: {}", request);
        Transaction transaction = createTransactionUseCase.execute(
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit(),
                request.getTranferTypeId(),
                request.getValue()
        );
        
        TransactionResponse response = transactionMapper.toResponse(transaction);
        log.info("Transaction created successfully: {}", response.getTransactionExternalId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Obtiene una transaccion x ID
     * GET /v1/transactions/{transactionExternalId}
     * 
     * @param transactionExternalId ID de la transaccion
     * @return TransactionResponse (200 OK)
     */
    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable UUID transactionExternalId ) {
        log.info("Starting /v1/transactions/{} - getTransaction method", transactionExternalId);
        Transaction transaction = getTransactionUseCase.execute(transactionExternalId);
        TransactionResponse response = transactionMapper.toResponse(transaction);
        log.info("Transaction retrieved successfully: {}", transactionExternalId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Transaction Service is UP");
    }
}

