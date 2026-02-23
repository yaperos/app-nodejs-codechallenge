package com.kafka.productor.infrastructure.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kafka.productor.application.usecase.service.create.CreateTransactionUseCase;
import com.kafka.productor.application.usecase.service.get.GetTransactionUseCase;
import com.kafka.productor.infrastructure.controller.dto.CreateTransactionRequest;
import com.kafka.productor.infrastructure.controller.dto.CreateTransactionResponse;
import com.kafka.productor.infrastructure.controller.dto.TransactionResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    @PostMapping
    public ResponseEntity<CreateTransactionResponse> create(
            @Valid @RequestBody CreateTransactionRequest request) {

        UUID transactionExternalId = createTransactionUseCase.execute(request.toCommand());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new CreateTransactionResponse(transactionExternalId));
    }

    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionResponse> get(
            @PathVariable UUID transactionExternalId) {

        return getTransactionUseCase.execute(transactionExternalId)
                .map(transaction -> ResponseEntity.ok(TransactionResponse.from(transaction)))
                .orElse(ResponseEntity.notFound().build());
    }
}
