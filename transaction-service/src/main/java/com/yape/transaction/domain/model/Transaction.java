package com.yape.transaction.domain.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Setter
@Getter
@RequiredArgsConstructor
public class Transaction {

  private final UUID id;
  private final double amount;
  private TransactionStatus status;
  private final Instant createdAt;

  public Transaction(UUID id, double amount) {
    this.id = id;
    this.amount = amount;
    this.status = TransactionStatus.PENDING;
    this.createdAt = Instant.now();
  }

  public Transaction(UUID id, double amount, TransactionStatus status, Instant createdAt) {
    this.id = id;
    this.amount = amount;
    this.status = status;
    this.createdAt = createdAt;
  }
}
