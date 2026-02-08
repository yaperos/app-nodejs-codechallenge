package com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web;

import com.yaperos.codechallenge.transaction.domain.model.Transaction;
import com.yaperos.codechallenge.transaction.domain.model.TransferType;
import com.yaperos.codechallenge.transaction.domain.port.input.CreateTransactionUseCase;
import com.yaperos.codechallenge.transaction.domain.port.input.GetTransactionUseCase;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.dto.CreateTransactionRequest;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.dto.TransactionResponse;
import com.yaperos.codechallenge.transaction.infrastructure.adapter.input.web.mapper.TransactionWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final CreateTransactionUseCase createTransactionUseCase;
    private final GetTransactionUseCase getTransactionUseCase;
    private final TransactionWebMapper mapper;

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@Valid @RequestBody CreateTransactionRequest request) {
        Transaction transaction = createTransactionUseCase.create(
                request.getAccountExternalIdDebit(),
                request.getAccountExternalIdCredit(),
                TransferType.fromId(request.getTranferTypeId()),
                request.getValue()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toResponse(transaction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getById(@PathVariable UUID id) {
        Transaction transaction = getTransactionUseCase.getById(id);
        return ResponseEntity.ok(mapper.toResponse(transaction));
    }

}
