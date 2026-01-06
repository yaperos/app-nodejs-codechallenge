package com.yape.transaction.infrastructure.api.controller;

import com.yape.transaction.application.dto.CreateTransactionCommand;
import com.yape.transaction.application.dto.TransactionResponse;
import com.yape.transaction.application.service.TransactionService;
import com.yape.transaction.infrastructure.api.dto.CreateTransactionRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller para gestión de transacciones
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Endpoint para crear una transacción
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request) {

        log.info("POST /api/v1/transactions - Creating transaction");

        CreateTransactionCommand command = CreateTransactionCommand.builder()
                .accountExternalIdDebit(request.getAccountExternalIdDebit())
                .accountExternalIdCredit(request.getAccountExternalIdCredit())
                .tranferTypeId(request.getTranferTypeId())
                .value(request.getValue())
                .build();

        TransactionResponse response = transactionService.createTransaction(command);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint para obtener una transacción por ID
     */
    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable UUID transactionExternalId) {

        log.info("GET /api/v1/transactions/{} - Getting transaction", transactionExternalId);

        TransactionResponse response = transactionService.getTransaction(transactionExternalId);

        return ResponseEntity.ok(response);
    }
}

