package com.yape.challenge.transaction.presentation.controller;

import com.yape.challenge.transaction.application.bus.CommandBus;
import com.yape.challenge.transaction.application.bus.QueryBus;
import com.yape.challenge.transaction.application.command.CreateTransactionCommand;
import com.yape.challenge.transaction.application.dto.request.CreateTransactionRequest;
import com.yape.challenge.transaction.application.dto.response.TransactionResponse;
import com.yape.challenge.transaction.application.query.GetTransactionQuery;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final CommandBus commandBus;
    private final QueryBus queryBus;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request) {
        log.info("POST /api/v1/transactions - Request: {}", request);

        // Create command from request
        CreateTransactionCommand command = CreateTransactionCommand.builder()
                .accountExternalIdDebit(request.getAccountExternalIdDebit())
                .accountExternalIdCredit(request.getAccountExternalIdCredit())
                .tranferTypeId(request.getTranferTypeId())
                .value(request.getValue())
                .build();

        // Dispatch command through command bus
        TransactionResponse response = commandBus.dispatch(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{externalId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable UUID externalId) {
        log.info("GET /api/v1/transactions/{}", externalId);

        // Create query
        GetTransactionQuery query = GetTransactionQuery.builder()
                .externalId(externalId)
                .build();

        // Dispatch query through query bus
        TransactionResponse response = queryBus.dispatch(query);
        return ResponseEntity.ok(response);
    }
}


