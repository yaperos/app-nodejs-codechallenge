package com.retotecnico.transaction.domain.port.in;

import com.retotecnico.transaction.domain.model.Transaction;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Input port - use case for creating a transaction.
 */
public interface CreateTransactionUseCase {

    Transaction execute(UUID accountExternalIdDebit,
                        UUID accountExternalIdCredit,
                        int transferTypeId,
                        BigDecimal value);
}
