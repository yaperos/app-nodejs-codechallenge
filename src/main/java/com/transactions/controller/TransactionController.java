package com.transactions.controller;

import com.transactions.model.dto.CreateTransactionRequest;
import com.transactions.model.dto.TransactionResponse;
import com.transactions.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

  private final TransactionService transactionService;

  @PostMapping
  public ResponseEntity<TransactionResponse> createTransaction(
    @Valid @RequestBody CreateTransactionRequest request) {
    TransactionResponse response = transactionService.createTransaction(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TransactionResponse> getTransaction(@PathVariable UUID id) {
    TransactionResponse response = transactionService.getTransaction(id);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
    List<TransactionResponse> responses = transactionService.getAllTransactions();
    return ResponseEntity.ok(responses);
  }

  @GetMapping("/health")
  public ResponseEntity<Map<String, Object>> healthCheck() {
    return ResponseEntity.ok(Map.of(
      "status", "ok",
      "timestamp", java.time.Instant.now(),
      "service", "transaction-anti-fraud-service"
    ));
  }
}