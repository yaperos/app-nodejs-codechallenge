package com.yape.transaction.application.service;

import java.util.UUID;
import org.springframework.stereotype.Service;
import com.yape.transaction.application.port.in.UpdateTransactionUseCase;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.out.TransactionRepository;

@Service
public class UpdateTransactionService implements UpdateTransactionUseCase {

  private final TransactionRepository repositoryApater;
  public UpdateTransactionService(TransactionRepository repository) {
    this.repositoryApater = repository;
  }

  @Override
  public void updateStatus(UUID transactionId, TransactionStatus status) {

    var transaction = repositoryApater.findById(transactionId)
      .orElseThrow(() -> new IllegalStateException("Transaction not found"));

    transaction.setStatus(status);
    repositoryApater.save(transaction);
  }
}
