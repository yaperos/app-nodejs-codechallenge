package com.jaragon.antifraud.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TransactionStatus {
  APPROVED("approved"),
  REJECTED("rejected");
  private final String value;
  TransactionStatus(String value) { this.value = value; }
  @JsonValue
  public String getValue() { return value; }
}
