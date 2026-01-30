package com.yape.services.shared.exception;

import lombok.Getter;

/**
 * Enumeration of error codes for GraphQL responses.
 * Provides standardized error classification across the application.
 */
@Getter
public enum ErrorCode {

  // Validation errors (400)
  VALIDATION_ERROR("VALIDATION_ERROR", "Validation failed"),
  INVALID_INPUT("INVALID_INPUT", "Invalid input provided"),
  INVALID_FORMAT("INVALID_FORMAT", "Invalid data format"),

  // Not found errors (404)
  RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Resource not found"),
  TRANSACTION_NOT_FOUND("TRANSACTION_NOT_FOUND", "Transaction not found"),
  TRANSFER_TYPE_NOT_FOUND("TRANSFER_TYPE_NOT_FOUND", "Transfer type not found"),
  TRANSACTION_STATUS_NOT_FOUND("TRANSACTION_STATUS_NOT_FOUND", "Transaction status not found"),

  // Business logic errors (422)
  BUSINESS_ERROR("BUSINESS_ERROR", "Business rule violation"),
  AMOUNT_BELOW_MINIMUM("AMOUNT_BELOW_MINIMUM", "Amount is below the minimum allowed"),

  // Internal errors (500)
  INTERNAL_ERROR("INTERNAL_ERROR", "Internal server error"),
  CONFIGURATION_ERROR("CONFIGURATION_ERROR", "Configuration error");

  private final String code;
  private final String defaultMessage;

  ErrorCode(String code, String defaultMessage) {
    this.code = code;
    this.defaultMessage = defaultMessage;
  }

}
