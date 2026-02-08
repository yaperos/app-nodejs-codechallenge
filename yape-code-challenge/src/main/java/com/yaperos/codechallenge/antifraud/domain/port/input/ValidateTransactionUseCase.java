package com.yaperos.codechallenge.antifraud.domain.port.input;

import java.math.BigDecimal;
import java.util.UUID;

public interface ValidateTransactionUseCase {

    void validate(UUID transactionExternalId, BigDecimal value);

}
