package com.jaragon.solution.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionResponseDTO {

  private UUID transactionExternalId;
  private TransactionTypeDTO transactionType;
  private TransactionStatusDTO transactionStatus;
  private Double value;
  private LocalDateTime createdAt;

  public TransactionResponseDTO(){

  }

  public TransactionResponseDTO(UUID transactionExternalId, TransactionTypeDTO transactionType, TransactionStatusDTO transactionStatus, Double value, LocalDateTime createdAt) {
    this.transactionExternalId = transactionExternalId;
    this.transactionType = transactionType;
    this.transactionStatus = transactionStatus;
    this.value = value;
    this.createdAt = createdAt;
  }

  public UUID getTransactionExternalId() {
    return transactionExternalId;
  }

  public void setTransactionExternalId(UUID transactionExternalId) {
    this.transactionExternalId = transactionExternalId;
  }

  public TransactionTypeDTO getTransactionType() {
    return transactionType;
  }

  public void setTransactionType(TransactionTypeDTO transactionType) {
    this.transactionType = transactionType;
  }

  public TransactionStatusDTO getTransactionStatus() {
    return transactionStatus;
  }

  public void setTransactionStatus(TransactionStatusDTO transactionStatus) {
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
}
