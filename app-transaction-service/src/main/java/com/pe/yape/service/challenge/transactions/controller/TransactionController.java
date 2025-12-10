package com.pe.yape.service.challenge.transactions.controller;

import com.pe.yape.service.challenge.transactions.dto.TransactionRequest;
import com.pe.yape.service.challenge.transactions.dto.TransactionResponse;
import com.pe.yape.service.challenge.transactions.service.TransactionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin(allowedHeaders = "*")
@RestController
@RequestMapping("/transactions")
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<TransactionResponse>> create(@Valid @RequestBody TransactionRequest request) {
        return transactionService.create(request).
                map(ResponseEntity::ok)
                .doOnError(throwable -> log.info("Error : {}" , throwable.getMessage()));
    }
}
