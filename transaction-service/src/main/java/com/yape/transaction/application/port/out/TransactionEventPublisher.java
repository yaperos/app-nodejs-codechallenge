package com.yape.transaction.application.port.out;

import com.yape.transaction.domain.model.Transaction;

public interface TransactionEventPublisher {
  void publish(Transaction transaction);
}
