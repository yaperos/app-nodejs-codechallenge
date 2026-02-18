package com.jotace.transaction.application.port.in;

import com.jotace.transaction.domain.model.Transaction;

public interface TransactionCreationUseCase {

    Transaction createTransaction(String accountExternalIdDebit, String accountExternalIdCredit, int tranferTypeId, double value);

}
