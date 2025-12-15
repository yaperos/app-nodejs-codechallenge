package com.transaction.app.infrastructure.controller;

import com.transaction.app.application.service.TransactionService;
import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.infrastructure.controller.dto.CreateTransactionRequest;
import com.transaction.app.infrastructure.controller.dto.TransactionResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@AllArgsConstructor
public class TransactionController {

    private final TransactionService  transactionService;

    @PostMapping
    public TransactionModel create(@RequestBody CreateTransactionRequest request) {
        return transactionService.create(request.toModel());
    }

    @GetMapping("/{externalId}")
    public TransactionResponse get(@PathVariable UUID externalId) {
        return transactionService.getByExternalId(externalId);
    }
}
