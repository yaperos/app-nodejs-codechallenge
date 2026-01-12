package com.msucre.transaction.infrastructure.postgresql.entity;

import com.msucre.transaction.domain.model.type.TransactionStatus;
import com.msucre.transaction.domain.model.type.TransactionType;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table(name = "transaction")
public class TransactionEntity {

  @Id
  public UUID id;

  @Column("source_account_id")
  public UUID sourceAccountId;

  @Column("created_at")
  public Long createdAt;

  @Column("destination_account_id")
  public UUID destinationAccountId;

  public TransactionStatus status;

  public TransactionType type;

  public float amount;
}
