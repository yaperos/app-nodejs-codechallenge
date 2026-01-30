package com.yape.services.transaction.domain.service;

import com.yape.services.common.util.Constants;
import com.yape.services.transaction.domain.model.ValidationResult;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import org.jboss.logging.Logger;

/**
 * Domain service responsible for anti-fraud transaction validation.
 * Implements business rules to determine if a transaction should be approved or rejected.
 */
@ApplicationScoped
public class AntiFraudValidationService {

  private static final Logger LOGGER = Logger.getLogger(AntiFraudValidationService.class);

  /**
   * Maximum allowed transaction amount.
   * Transactions exceeding this value will be rejected.
   */
  private static final BigDecimal MAX_TRANSACTION_AMOUNT = new BigDecimal("1000");

  /**
   * Validates a transaction based on anti-fraud rules.
   *
   * @param transactionValue the monetary value of the transaction
   * @return ValidationResult indicating whether the transaction is approved or rejected
   */
  public ValidationResult validate(BigDecimal transactionValue) {
    LOGGER.debugf("Validating transaction with value: %s", transactionValue);

    // Rule: Reject transactions with value greater than 1000
    if (transactionValue.compareTo(MAX_TRANSACTION_AMOUNT) > 0) {
      LOGGER.infof("Transaction rejected: value %s exceeds maximum allowed %s",
          transactionValue, MAX_TRANSACTION_AMOUNT);
      return ValidationResult.rejected(Constants.RULE_MAX_AMOUNT_EXCEEDED);
    }

    LOGGER.debugf("Transaction approved with value: %s", transactionValue);
    return ValidationResult.approved();
  }

}
