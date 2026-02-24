package com.yape.transaction_service.controller;

import com.yape.transaction_service.dto.CreateTransactionRequest;
import com.yape.transaction_service.dto.GetTransactionResponse;
import com.yape.transaction_service.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<GetTransactionResponse> create(@RequestBody CreateTransactionRequest request) {
        GetTransactionResponse response = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{externalId}")
    public ResponseEntity<GetTransactionResponse> get(@PathVariable UUID externalId) {
        return ResponseEntity.ok(service.getByExternalId(externalId));
    }
}