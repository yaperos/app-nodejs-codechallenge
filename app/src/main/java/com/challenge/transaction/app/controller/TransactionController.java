package com.challenge.transaction.app.controller;

import com.challenge.transaction.app.dto.CreateTransactionRequest;
import com.challenge.transaction.app.dto.TransactionResponse;
import com.challenge.transaction.app.mapper.TransactionMapper;
import com.challenge.transaction.core.domain.model.Transaction;
import com.challenge.transaction.core.ports.input.CreateTransactionUseCase;
import com.challenge.transaction.core.ports.input.GetTransactionUseCase;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@AllArgsConstructor
public class TransactionController {

    private final CreateTransactionUseCase createUseCase;
    private final GetTransactionUseCase getUseCase;

    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @RequestBody CreateTransactionRequest request) {
        Transaction transaction = TransactionMapper.MAPPER.toDomain(request);
        Transaction saved = createUseCase.create(transaction);

        return ResponseEntity.ok(TransactionMapper.MAPPER.toResponse(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> get(@PathVariable UUID id) {
        Transaction transaction = getUseCase.get(id);

        return ResponseEntity.ok(TransactionMapper.MAPPER.toResponse(transaction));
    }
}
