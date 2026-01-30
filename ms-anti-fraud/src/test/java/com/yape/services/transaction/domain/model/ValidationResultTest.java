package com.yape.services.transaction.domain.model;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for the ValidationResult class.
 */
class ValidationResultTest {

  @Test
  void approved_shouldReturnValidTrueAndNullRuleCode() {
    // Arrange

    // Act
    ValidationResult result = ValidationResult.approved();

    // Assert
    Assertions.assertTrue(result.isValid());
    Assertions.assertNull(result.getRuleCode());
  }

  @Test
  void rejected_shouldReturnValidFalseAndRuleCode() {
    // Arrange
    String ruleCode = "MAX_AMOUNT_EXCEEDED";

    // Act
    ValidationResult result = ValidationResult.rejected(ruleCode);

    // Assert
    Assertions.assertFalse(result.isValid());
    Assertions.assertEquals(ruleCode, result.getRuleCode());
  }
}
