package com.yape.transaction.application.port.in;

import java.util.List;
import java.util.UUID;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.infrastructure.rest.dto.TransactionRequest;

public interface TransactionUseCase {
  Transaction create(TransactionRequest request);
  Transaction getById(UUID transactionId);
  List<Transaction> getAllTransactions();
}
