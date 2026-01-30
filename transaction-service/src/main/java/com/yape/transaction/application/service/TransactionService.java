package com.yape.transaction.application.service;

import java.util.List;
import java.util.UUID;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.application.port.in.TransactionUseCase;
import com.yape.transaction.application.port.out.TransactionEventPublisher;
import com.yape.transaction.domain.port.out.TransactionRepository;
import com.yape.transaction.infrastructure.rest.dto.TransactionRequest;
import org.springframework.stereotype.Service;

@Service
public class TransactionService implements TransactionUseCase {

  private final TransactionRepository repositoryAdapter;
  private final TransactionEventPublisher publisher;

  public TransactionService(TransactionRepository repository, TransactionEventPublisher publisher) {
    this.repositoryAdapter = repository;
    this.publisher = publisher;
  }

  @Override
  public Transaction create(TransactionRequest request) {
    Transaction tx = new Transaction(UUID.randomUUID(), request.getAmount());

    repositoryAdapter.save(tx);
    publisher.publish(tx);
    return tx;
  }

  @Override
  public Transaction getById(UUID transactionId) {
    return repositoryAdapter.findById(transactionId)
      .orElseThrow(() -> new IllegalStateException("Transaction not found"));
  }

  @Override
  public List<Transaction> getAllTransactions() {

    var listTransaction = repositoryAdapter.findAll();
    if(listTransaction.isEmpty())
       throw new IllegalStateException("Transactions not found");
    return listTransaction;
  }
}
