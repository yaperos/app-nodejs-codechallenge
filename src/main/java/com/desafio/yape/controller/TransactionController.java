package com.desafio.yape.controller;

import com.desafio.yape.dto.CreateTransactionRequest;
import com.desafio.yape.dto.TransactionResponse;
import com.desafio.yape.model.Transaction;
import com.desafio.yape.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final ApiResponseBuilder apiResponseBuilder;

    public TransactionController(TransactionService transactionService, ApiResponseBuilder apiResponseBuilder) {
        this.transactionService = transactionService;
        this.apiResponseBuilder = apiResponseBuilder;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateTransactionRequest req) {
        if (req.getAccountExternalIdDebit() == null || req.getAccountExternalIdCredit() == null || req.getTranferTypeId() == null || req.getValue() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        Transaction saved = transactionService.create(req);

        return ResponseEntity.status(201).body(toResponse(saved));
    }

    @GetMapping("/{externalId}")
    public ResponseEntity<?> get(@PathVariable String externalId) {
        Transaction tx = transactionService.findByExternalId(externalId);
        if (tx == null) {
            return apiResponseBuilder.transactionNotFound(externalId);
        }
        return ResponseEntity.ok(toResponse(tx));
    }

    private TransactionResponse toResponse(Transaction tx) {
        TransactionResponse r = new TransactionResponse();
        r.setTransactionExternalId(tx.getTransactionExternalId());
        TransactionResponse.Type t = new TransactionResponse.Type();
        t.setName(tx.getTransactionType().getName());
        r.setTransactionType(t);
        TransactionResponse.Status s = new TransactionResponse.Status();
        s.setName(tx.getTransactionStatus().getName());
        r.setTransactionStatus(s);
    r.setValue(tx.getAmount());
        r.setCreatedAt(tx.getCreatedAt());
        return r;
    }
}
