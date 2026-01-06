package com.yape.transactions.service;

public class InvalidUuidException extends RuntimeException {
  public InvalidUuidException(String raw) {
    super("Invalid UUID: " + raw);
  }
}
