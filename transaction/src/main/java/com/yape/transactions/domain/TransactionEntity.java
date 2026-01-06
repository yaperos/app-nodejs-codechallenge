package com.yape.transactions.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class TransactionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "transaction_external_id", nullable = false, unique = true)
  private UUID transactionExternalId;

  @Column(name = "account_external_id_debit", nullable = false)
  private String accountExternalIdDebit;

  @Column(name = "account_external_id_credit", nullable = false)
  private String accountExternalIdCredit;

  @Column(name = "tranfer_type_id", nullable = false)
  private Integer tranferTypeId;

  @Column(nullable = false, precision = 18, scale = 2)
  private BigDecimal value;

  @Column(nullable = false)
  private String status; // pending | approved | rejected

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  protected TransactionEntity() {}

  public TransactionEntity(
      UUID transactionExternalId,
      String accountExternalIdDebit,
      String accountExternalIdCredit,
      Integer tranferTypeId,
      BigDecimal value,
      String status,
      Instant createdAt
  ) {
    this.transactionExternalId = transactionExternalId;
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.tranferTypeId = tranferTypeId;
    this.value = value;
    this.status = status;
    this.createdAt = createdAt;
  }

  public Long getId() {
    return id;
  }

  public UUID getTransactionExternalId() {
    return transactionExternalId;
  }

  public String getAccountExternalIdDebit() {
    return accountExternalIdDebit;
  }

  public String getAccountExternalIdCredit() {
    return accountExternalIdCredit;
  }

  public Integer getTranferTypeId() {
    return tranferTypeId;
  }

  public BigDecimal getValue() {
    return value;
  }

  public String getStatus() {
    return status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
