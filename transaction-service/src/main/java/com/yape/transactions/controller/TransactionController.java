package com.yape.transactions.controller;

import com.yape.transactions.dto.request.TransactionRequest;
import com.yape.transactions.dto.response.TransactionResponse;
import com.yape.transactions.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @MutationMapping
    public TransactionResponse createTransaction(@Argument TransactionRequest request) {
        return transactionService.create(request);
    }

    @QueryMapping
    public TransactionResponse getTransaction(@Argument UUID id) {
        return transactionService.getById(id);
    }
}
