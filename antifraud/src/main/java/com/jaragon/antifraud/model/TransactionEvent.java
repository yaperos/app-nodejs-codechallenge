package com.jaragon.antifraud.model;

import java.util.UUID;

public class TransactionEvent {
  private UUID transactionExternalId;
  private Double value;

  public TransactionEvent() {}

  public TransactionEvent(UUID transactionExternalId, Double value) {
    this.transactionExternalId = transactionExternalId;
    this.value = value;
  }

  public UUID getTransactionExternalId() { return transactionExternalId; }
  public void setTransactionExternalId(UUID transactionExternalId) { this.transactionExternalId = transactionExternalId; }
  public Double getValue() { return value; }
  public void setValue(Double value) { this.value = value; }
}
