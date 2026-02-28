package com.example.transactionservice.controller;

import com.example.transactionservice.domain.Transaction;
import com.example.transactionservice.dto.CreateTransactionRequest;
import com.example.transactionservice.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping
    public Mono<ResponseEntity<Transaction>> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request) {
        log.info("POST /api/v1/transactions - Creating transaction");
        
        return transactionService.createTransaction(request)
            .map(transaction -> ResponseEntity.status(HttpStatus.CREATED).body(transaction))
            .onErrorResume(error -> {
                log.error("Error creating transaction: {}", error.getMessage());
                return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
            });
    }

    @GetMapping("")
    public ResponseEntity<Flux<Transaction>> getTransactions() {
        log.info("GET /api/v1/transactions - Retrieving all transactions");

        Flux<Transaction> transactions = transactionService.getAllTransactions();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new ResponseEntity<>(transactions, headers, HttpStatus.OK);
    }

    
    @GetMapping("/health")
    public Mono<ResponseEntity<String>> health() {
        return Mono.just(ResponseEntity.ok("Transaction Service is running"));
    }
}
