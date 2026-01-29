package com.jaragon.antifraud.model;

import java.util.UUID;

public class AntifraudResponse {
  private UUID transactionExternalId;
  private String status;
  private String code;

  public AntifraudResponse() {}

  public AntifraudResponse(UUID transactionExternalId, TransactionStatus status, TransactionCode code) {
    this.transactionExternalId = transactionExternalId;
    this.status = status.getValue();
    this.code = code.getValue();
  }

  public UUID getTransactionExternalId() { return transactionExternalId; }
  public void setTransactionExternalId(UUID transactionExternalId) { this.transactionExternalId = transactionExternalId; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

}
