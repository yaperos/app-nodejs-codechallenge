package com.msucre.transaction.infrastructure.controller;

import com.msucre.transaction.application.usecase.transaction.CreateTransactionCase;
import com.msucre.transaction.application.usecase.transaction.FindTransactionCase;
import com.msucre.transaction.application.usecase.transaction.FindTransactionsByAccountCase;
import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.model.ui.CreateTransactionResponse;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

  private final CreateTransactionCase createTransactionCase;

  private final FindTransactionCase findTransactionCase;

  private final FindTransactionsByAccountCase  findTransactionsByAccountCase;


  public TransactionController(CreateTransactionCase createTransactionCase, FindTransactionCase findTransactionCase,
                               FindTransactionsByAccountCase findTransactionsByAccountCase) {
    this.createTransactionCase = createTransactionCase;
    this.findTransactionCase = findTransactionCase;
    this.findTransactionsByAccountCase = findTransactionsByAccountCase;
  }

  @PostMapping
  public Mono<CreateTransactionResponse> handleCreateTransaction(@RequestBody Transaction transaction) {
    return createTransactionCase.execute(transaction)
        .map(transactionId -> new CreateTransactionResponse("Transaction created successfully", transactionId));
  }

  @GetMapping("/{id}")
  public Mono<Transaction> handleGetTransaction(@PathVariable("id") String id) {
    return findTransactionCase.execute(id);
  }

  @GetMapping("/account/{accountId}")
  public Flux<Transaction> handleGetTransactionsByAccount(@PathVariable("accountId") String accountId) {
    return findTransactionsByAccountCase.execute(accountId);
  }
}
