package com.yape.transaction.infrastructure.db.entity;

import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "transactions")
public class TransactionEntity {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "amount", nullable = false)
  private double value;

  @Column(nullable = false)
  private String status;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  protected TransactionEntity() {
  }

  private TransactionEntity(
    UUID id,
    double value,
    String status,
    Instant createdAt) {

    this.id = id;
    this.value = value;
    this.status = status;
    this.createdAt = createdAt;
  }

  public static TransactionEntity from(Transaction tx) {
    return new TransactionEntity(tx.getId(), tx.getAmount(), tx.getStatus().name(), tx.getCreatedAt());
  }

  public Transaction toDomain() {
    return new Transaction(
      this.id,
      this.value,
      TransactionStatus.valueOf(this.status),
      this.createdAt
    );
  }
}
