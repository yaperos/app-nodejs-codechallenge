package com.joma.transaction.controller;

import com.joma.transaction.dto.TransactionRequest;
import com.joma.transaction.dto.TransactionResponse;
import com.joma.transaction.entity.Transaction;
import com.joma.transaction.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public Mono<Transaction> getTransaction(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody TransactionRequest request) {
        TransactionResponse response = service.createTransaction(request);
        return ResponseEntity.ok(response);
    }

}
