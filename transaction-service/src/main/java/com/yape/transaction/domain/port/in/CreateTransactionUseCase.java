package com.yape.transaction.domain.port.in;

import com.yape.transaction.domain.model.Transaction;

import java.math.BigDecimal;
import java.util.UUID;

public interface CreateTransactionUseCase {

    Transaction execute(Command command);

    record Command(
            UUID accountExternalIdDebit,
            UUID accountExternalIdCredit,
            Integer transferTypeId,
            BigDecimal value
    ) {
        public Command {
            if (value == null || value.compareTo(BigDecimal.ZERO) <= 0)
                throw new IllegalArgumentException("Value must be greater than zero");
            if (accountExternalIdDebit == null || accountExternalIdCredit == null)
                throw new IllegalArgumentException("Account IDs cannot be null");
        }
    }
}
