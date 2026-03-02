package com.yape.infra.adapter.in.rest;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yape.application.port.in.CreateTransactionUseCase;
import com.yape.application.port.in.GetTransactionUseCase;
import com.yape.domain.model.Transaction;
import com.yape.infra.adapter.in.rest.dto.TransactionResponse;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    @PostMapping
    public Mono<ResponseEntity<TransactionResponse>> createTransaction(@RequestBody Transaction transaction) {
        return createTransactionUseCase.createTransaction(transaction)
                .map(createdTransaction -> new ResponseEntity<>(TransactionResponse.fromDomain(createdTransaction), HttpStatus.CREATED));
    }

    @GetMapping("/{transactionExternalId}")
    public Mono<ResponseEntity<TransactionResponse>> getTransaction(@PathVariable UUID transactionExternalId) {
        return getTransactionUseCase.getTransaction(transactionExternalId)
                .map(transaction -> ResponseEntity.ok(TransactionResponse.fromDomain(transaction)));
    }
}
