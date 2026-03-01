package com.retotecnico.transaction.infrastructure.adapter.in.rest;

import com.retotecnico.transaction.application.dto.CreateTransactionRequest;
import com.retotecnico.transaction.application.dto.TransactionResponse;
import com.retotecnico.transaction.domain.model.Transaction;
import com.retotecnico.transaction.domain.port.in.CreateTransactionUseCase;
import com.retotecnico.transaction.domain.port.in.GetTransactionUseCase;
import jakarta.validation.Valid;
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
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request) {

        Transaction transaction = createTransactionUseCase.execute(
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit(),
                request.getTranferTypeId(),
                request.getValue()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(TransactionResponse.fromDomain(transaction));
    }

    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable UUID transactionExternalId) {

        Transaction transaction = getTransactionUseCase.execute(transactionExternalId);

        return ResponseEntity.ok(TransactionResponse.fromDomain(transaction));
    }
}
