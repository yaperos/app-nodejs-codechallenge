package com.yape.transactions.service;

public class TransactionNotFoundException extends RuntimeException {
  public TransactionNotFoundException(String externalId) {
    super("Transaction not found: " + externalId);
  }
}
