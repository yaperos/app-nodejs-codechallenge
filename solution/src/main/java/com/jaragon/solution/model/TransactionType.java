package com.jaragon.solution.model;

public enum TransactionType {
  DEBIT("DEBIT"),
  CREDIT("CREDIT");
  private final String value;
  TransactionType(String value) { this.value = value; }
  public String getValue() { return value; }
}
