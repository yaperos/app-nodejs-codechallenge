package com.yape.transaction.domain.port.in;

import com.yape.transaction.domain.model.Transaction;
import java.math.BigDecimal;
import java.util.UUID;


public interface CreateTransactionUseCase {

    /**
     * Creates a new transaction with pending status.
     *
     * @param accountExternalIdDebit  the debit account ID
     * @param accountExternalIdCredit the credit account ID
     * @param transferTypeId          the type of transfer
     * @param value                   the transaction value
     * @return the created transaction
     */
    Transaction createTransaction(UUID accountExternalIdDebit, UUID accountExternalIdCredit,
                                  Integer transferTypeId, BigDecimal value);
}
