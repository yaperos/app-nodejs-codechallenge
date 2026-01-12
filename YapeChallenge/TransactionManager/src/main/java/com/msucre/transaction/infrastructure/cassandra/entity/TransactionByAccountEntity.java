package com.msucre.transaction.infrastructure.cassandra.entity;

import com.msucre.transaction.domain.model.type.TransactionStatus;
import com.msucre.transaction.domain.model.type.TransactionType;
import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;


@Table("transaction_by_account")
public class TransactionByAccountEntity {

  @PrimaryKeyColumn(name = "source_account_id", type = PrimaryKeyType.PARTITIONED)
  public UUID sourceAccountId;

  @PrimaryKeyColumn(name = "created_at", type = PrimaryKeyType.CLUSTERED, ordering = Ordering.DESCENDING)
  public Long createdAt;

  @PrimaryKeyColumn(name = "transaction_id", type = PrimaryKeyType.CLUSTERED)
  public UUID transactionId;

  @Column("destination_account_id")
  public UUID destinationAccountId;

  public TransactionStatus status;

  public TransactionType type;

  public float amount;
}