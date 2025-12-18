package com.yape.transactions.controller;

import com.yape.transactions.dto.CreateTransactionRequest;
import com.yape.transactions.dto.TransactionResponse;
import com.yape.transactions.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse createTransactionEvent(
            @Valid @RequestBody CreateTransactionRequest createTransactionRequest) {
        return transactionService.createTransactionEvent(createTransactionRequest);
    }

    @GetMapping(value = "/{transactionExternalId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public TransactionResponse readTransaction(
            @PathVariable UUID transactionExternalId) {
        return transactionService.readTransaction(transactionExternalId);
    }
}
