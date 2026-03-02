package com.yape.antifraud.domain.service;

import com.yape.antifraud.domain.model.TransactionToValidate;
import com.yape.antifraud.domain.model.ValidationResult;
import com.yape.antifraud.domain.port.in.ValidateTransactionUseCase;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.math.BigDecimal;

@ApplicationScoped
public class FraudValidationService implements ValidateTransactionUseCase {

    private static final Logger LOG = Logger.getLogger(FraudValidationService.class);

    @ConfigProperty(name = "antifraud.max-transaction-value", defaultValue = "1000")
    BigDecimal maxTransactionValue;

    @Override
    public ValidationResult validate(TransactionToValidate transaction) {
        LOG.infof("Validating transaction: %s with value: %s", 
                transaction.getTransactionExternalId(), transaction.getValue());

        // Regla 1: if value > 1000
        if (transaction.getValue().compareTo(maxTransactionValue) > 0) {
            LOG.infof("Transaction %s REJECTED: value %s exceeds maximum %s",
                    transaction.getTransactionExternalId(),
                    transaction.getValue(),
                    maxTransactionValue);
            
            return ValidationResult.rejected(
                    transaction.getTransactionExternalId(),
                    "Transaction value exceeds maximum allowed: " + maxTransactionValue
            );
        }

        LOG.infof("Transaction %s APPROVED: value %s is within limits",
                transaction.getTransactionExternalId(),
                transaction.getValue());

        return ValidationResult.approved(transaction.getTransactionExternalId());
    }
}
