package com.yape.services.common.util;

/**
 * Constants used across the anti-fraud service.
 */
public final class Constants {

  private Constants() {
    // Utility class, prevent instantiation
  }

  // Event sources
  public static final String EVENT_SOURCE = "ms-anti-fraud";

  // Event types
  public static final String EVENT_TYPE_TRANSACTION_STATUS_UPDATED = "TRANSACTION_STATUS_UPDATED";

  // Transaction statuses
  public static final String TRANSACTION_STATUS_PENDING = "PENDING";
  public static final String TRANSACTION_STATUS_APPROVED = "APPROVED";
  public static final String TRANSACTION_STATUS_REJECTED = "REJECTED";

  // Validation rules
  public static final String RULE_MAX_AMOUNT_EXCEEDED = "MAX_AMOUNT_EXCEEDED";

  // Default schema version
  public static final String SCHEMA_VERSION = "1.0.0";

}
