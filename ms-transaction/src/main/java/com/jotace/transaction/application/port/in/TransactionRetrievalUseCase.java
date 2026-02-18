package com.jotace.transaction.application.port.in;

import com.jotace.transaction.domain.model.Transaction;

import java.util.UUID;

public interface TransactionRetrievalUseCase {

    Transaction getTransactionById(UUID uuid);

}
