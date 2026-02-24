package com.yape.transaction.infrastructure.adapter.in.rest;

import com.yape.transaction.application.port.in.CreateTransactionUseCase;
import com.yape.transaction.application.port.in.GetTransactionUseCase;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.infrastructure.adapter.in.rest.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody Transaction transaction) {
        Transaction createdTransaction = createTransactionUseCase.createTransaction(transaction);
        return new ResponseEntity<>(TransactionResponse.fromDomain(createdTransaction), HttpStatus.CREATED);
    }

    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable UUID transactionExternalId) {
        Transaction transaction = getTransactionUseCase.getTransaction(transactionExternalId);
        return ResponseEntity.ok(TransactionResponse.fromDomain(transaction));
    }
}
