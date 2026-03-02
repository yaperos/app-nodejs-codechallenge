package com.codeh.transaction_service.controller;

import com.codeh.transaction_service.dto.request.CreateTransactionRequest;
import com.codeh.transaction_service.dto.response.TransactionResponse;
import com.codeh.transaction_service.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(transactionService.createTransaction(request));
    }

    @GetMapping("/{externalId}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable UUID externalId) {
        return ResponseEntity.ok(transactionService.getByExternalId(externalId));
    }
}