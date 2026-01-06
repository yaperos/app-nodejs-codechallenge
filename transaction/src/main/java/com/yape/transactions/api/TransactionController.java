package com.yape.transactions.api;

import com.yape.transactions.api.dto.CreateTransactionRequest;
import com.yape.transactions.api.dto.CreateTransactionResponse;
import com.yape.transactions.api.dto.TransactionResponse;
import com.yape.transactions.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

  private final TransactionService transactionService;

  public TransactionController(TransactionService transactionService) {
    this.transactionService = transactionService;
  }

  @PostMapping
  public ResponseEntity<CreateTransactionResponse> create(@Valid @RequestBody CreateTransactionRequest request) {
    String externalId = transactionService.createTransaction(request);
    return ResponseEntity.status(201).body(new CreateTransactionResponse(externalId));
  }

  @GetMapping("/{transactionExternalId}")
  public TransactionResponse get(@PathVariable String transactionExternalId) {
    return transactionService.getTransaction(transactionExternalId);
  }
}
