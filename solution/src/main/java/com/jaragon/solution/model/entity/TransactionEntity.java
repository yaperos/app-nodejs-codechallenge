package com.jaragon.solution.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
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
  private UUID accountExternalIdDebit;

  @Column(name = "account_external_id_credit", nullable = false)
  private UUID accountExternalIdCredit;

  @Column(name = "transaction_type", nullable = false)
  private String transactionType;

  @Column(name = "transaction_status", nullable = false)
  private String transactionStatus;

  @Column(nullable = false)
  private Double value;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UUID getTransactionExternalId() {
    return transactionExternalId;
  }

  public void setTransactionExternalId(UUID transactionExternalId) {
    this.transactionExternalId = transactionExternalId;
  }

  public String getTransactionType() {
    return transactionType;
  }

  public void setTransactionType(String transactionType) {
    this.transactionType = transactionType;
  }

  public String getTransactionStatus() {
    return transactionStatus;
  }

  public void setTransactionStatus(String transactionStatus) {
    this.transactionStatus = transactionStatus;
  }

  public Double getValue() {
    return value;
  }

  public void setValue(Double value) {
    this.value = value;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public UUID getAccountExternalIdDebit() {
    return accountExternalIdDebit;
  }

  public void setAccountExternalIdDebit(UUID accountExternalIdDebit) {
    this.accountExternalIdDebit = accountExternalIdDebit;
  }

  public UUID getAccountExternalIdCredit() {
    return accountExternalIdCredit;
  }

  public void setAccountExternalIdCredit(UUID accountExternalIdCredit) {
    this.accountExternalIdCredit = accountExternalIdCredit;
  }
}
