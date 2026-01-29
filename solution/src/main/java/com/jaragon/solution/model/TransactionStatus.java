package com.jaragon.solution.model;

public enum TransactionStatus {
  APPROVED("approved"),
  REJECTED("rejected"),
  PENDING("pending");
  private final String value;
  TransactionStatus(String value) { this.value = value; }
  public String getValue() { return value; }
}
