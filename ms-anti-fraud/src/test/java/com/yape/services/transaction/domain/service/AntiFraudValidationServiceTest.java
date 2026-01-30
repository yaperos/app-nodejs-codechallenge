package com.yape.services.transaction.domain.service;

import com.yape.services.common.util.Constants;
import com.yape.services.transaction.domain.model.ValidationResult;
import java.math.BigDecimal;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for AntiFraudValidationService.
 */
class AntiFraudValidationServiceTest {

  private final AntiFraudValidationService service = new AntiFraudValidationService();

  @Test
  @DisplayName("Should approve transaction when amount is below or equal to max limit")
  void shouldApproveTransactionWhenAmountIsBelowOrEqualToMax() {
    // Arrange
    BigDecimal amount = new BigDecimal("500");

    // Act
    ValidationResult result = service.validate(amount);

    // Assert
    Assertions.assertTrue(result.isValid());
    Assertions.assertNull(result.getRuleCode());
  }

  @Test
  @DisplayName("Should reject transaction when amount exceeds max limit")
  void shouldRejectTransactionWhenAmountExceedsMax() {
    // Arrange
    BigDecimal amount = new BigDecimal("1000.01");

    // Act
    ValidationResult result = service.validate(amount);

    // Assert
    Assertions.assertFalse(result.isValid());
    Assertions.assertEquals(Constants.RULE_MAX_AMOUNT_EXCEEDED, result.getRuleCode());
  }
}
