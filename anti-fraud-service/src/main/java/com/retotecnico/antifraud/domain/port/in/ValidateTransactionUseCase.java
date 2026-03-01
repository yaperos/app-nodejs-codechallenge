package com.retotecnico.antifraud.domain.port.in;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Input port - use case for validating a transaction against fraud rules.
 */
public interface ValidateTransactionUseCase {

    String execute(UUID transactionExternalId, BigDecimal value);
}
