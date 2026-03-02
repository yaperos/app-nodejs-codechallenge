package com.yape.antifraud.domain.port.in;

import com.yape.antifraud.domain.model.TransactionToValidate;
import com.yape.antifraud.domain.model.ValidationResult;

public interface ValidateTransactionUseCase {

    /**
     * Validates a transaction against fraud rules.
     *
     * @param transaction the transaction to validate
     * @return the validation result
     */
    ValidationResult validate(TransactionToValidate transaction);
}
