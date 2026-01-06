package com.yape.payment.transaction.api;

import com.yape.payment.transaction.api.dto.CreateTransactionRequest;
import com.yape.payment.transaction.api.dto.TransactionResponse;
import com.yape.payment.transaction.application.TransactionService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse create(@Valid @RequestBody CreateTransactionRequest request) {
        return transactionService.create(request);
    }

    @GetMapping("/{transactionExternalId}")
    public TransactionResponse get(@PathVariable UUID transactionExternalId) {
        return transactionService.get(transactionExternalId);
    }
}
