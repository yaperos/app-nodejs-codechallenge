package com.jaragon.antifraud.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TransactionCode {
  OK("OK"),
  ERROR("ERROR");
  private final String value;
  TransactionCode(String value) { this.value = value; }
  @JsonValue
  public String getValue() { return value; }
}
