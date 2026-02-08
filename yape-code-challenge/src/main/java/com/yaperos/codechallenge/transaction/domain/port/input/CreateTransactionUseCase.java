package com.yaperos.codechallenge.transaction.domain.port.input;

import com.yaperos.codechallenge.transaction.domain.model.Transaction;
import com.yaperos.codechallenge.transaction.domain.model.TransferType;

import java.math.BigDecimal;
import java.util.UUID;

public interface CreateTransactionUseCase {

    Transaction create(UUID accountExternalIdDebit,
                       UUID accountExternalIdCredit,
                       TransferType transferType,
                       BigDecimal value);

}
