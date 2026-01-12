package com.msucre.transaction.application.usecase.transaction;

import com.msucre.transaction.domain.model.Transaction;
import com.msucre.transaction.domain.repository.TransactionByAccountRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Component
public class FindTransactionsByAccountCase {

  private final TransactionByAccountRepository transactionByAccountRepository;

  public FindTransactionsByAccountCase(TransactionByAccountRepository transactionByAccountRepository) {
    this.transactionByAccountRepository = transactionByAccountRepository;
  }

  public Flux<Transaction> execute(String accountId) {
    return transactionByAccountRepository.findTransactionsByAccount(UUID.fromString(accountId));
  }
}
