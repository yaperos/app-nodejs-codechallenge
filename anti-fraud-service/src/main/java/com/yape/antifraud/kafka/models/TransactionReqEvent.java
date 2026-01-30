package com.yape.antifraud.kafka.models;

import java.util.UUID;
import com.yape.antifraud.model.TransactionStatus;

public class TransactionReqEvent {
  private UUID id;
  private double amount;
  private TransactionStatus status;

  public TransactionReqEvent() {}

  public TransactionReqEvent(UUID id, double amount, TransactionStatus status) {
    this.id = id;
    this.amount = amount;
    this.status = status;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public double getAmount() {
    return amount;
  }

  public void setAmount(double amount) {
    this.amount = amount;
  }

  public TransactionStatus getStatus() {
    return status;
  }

  public void setStatus(TransactionStatus status) {
    this.status = status;
  }
}
