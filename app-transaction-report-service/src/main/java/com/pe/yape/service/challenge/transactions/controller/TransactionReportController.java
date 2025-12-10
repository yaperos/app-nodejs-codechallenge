package com.pe.yape.service.challenge.transactions.controller;

import com.pe.yape.service.challenge.transactions.dto.TransactionResponse;
import com.pe.yape.service.challenge.transactions.service.SearchTransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin(allowedHeaders = "*")
@RestController
@RequestMapping("/transactions")
@Slf4j
public class TransactionReportController {

    private final SearchTransactionService searchTransactionService;

    public TransactionReportController(SearchTransactionService searchTransactionService) {
        this.searchTransactionService = searchTransactionService;
    }

    @GetMapping(value = "/{transactionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<TransactionResponse>> retrieve(@PathVariable String transactionId) {
        return searchTransactionService.search(transactionId)
                .map(ResponseEntity::ok);
    }
}
