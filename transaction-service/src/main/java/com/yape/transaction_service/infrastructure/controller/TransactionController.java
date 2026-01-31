package com.yape.transaction_service.infrastructure.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.yape.transaction_service.application.dto.CreateTransactionRequest;
import com.yape.transaction_service.application.dto.TransactionResponse;
import com.yape.transaction_service.application.service.TransactionService;

import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<TransactionResponse> create(
            @RequestBody CreateTransactionRequest request) {
        log.info("Received request to create transaction: {}", request);
        return transactionService.create(request);
    }

    @GetMapping("/{externalId}")
    public Mono<TransactionResponse> getByExternalId(
            @PathVariable UUID externalId) {
        return transactionService.getByExternalId(externalId);
    }

}
