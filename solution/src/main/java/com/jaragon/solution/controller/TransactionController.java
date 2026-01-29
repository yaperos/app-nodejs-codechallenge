package com.jaragon.solution.controller;

import com.jaragon.solution.model.CreateTransactionRequestDTO;
import com.jaragon.solution.model.TransactionResponseDTO;
import com.jaragon.solution.service.TransactionService;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

  private final TransactionService transactionService;

  public TransactionController(TransactionService transactionService) {
    this.transactionService = transactionService;
  }

  @PostMapping()
  public ResponseEntity<TransactionResponseDTO> createTransaction(
      @RequestBody CreateTransactionRequestDTO request) {

    TransactionResponseDTO response = transactionService.createTransaction(request);

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/{transactionExternalId}")
  public ResponseEntity<TransactionResponseDTO> retrieveTransaction(
      @PathVariable UUID transactionExternalId) {

    TransactionResponseDTO response = transactionService.getTransaction(transactionExternalId);

    return ResponseEntity.ok(response);
  }
}
