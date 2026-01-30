package com.yape.transaction.application.port.in;

import java.util.UUID;
import com.yape.transaction.domain.model.TransactionStatus;

public interface UpdateTransactionUseCase {
  void updateStatus(UUID transactionId, TransactionStatus status);
}