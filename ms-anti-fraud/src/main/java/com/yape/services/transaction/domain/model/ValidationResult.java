package com.yape.services.transaction.domain.model;

/**
 * Result of the anti-fraud validation process.
 */
public class ValidationResult {

  private final boolean valid;
  private final String ruleCode;

  private ValidationResult(boolean valid, String ruleCode) {
    this.valid = valid;
    this.ruleCode = ruleCode;
  }

  /**
   * Creates a validation result indicating approval.
   *
   * @return ValidationResult indicating the transaction is approved
   */
  public static ValidationResult approved() {
    return new ValidationResult(true, null);
  }

  /**
   * Creates a validation result indicating rejection.
   *
   * @param ruleCode the code of the rule that caused rejection
   * @return ValidationResult indicating the transaction is rejected
   */
  public static ValidationResult rejected(String ruleCode) {
    return new ValidationResult(false, ruleCode);
  }

  public boolean isValid() {
    return valid;
  }

  public String getRuleCode() {
    return ruleCode;
  }

}
