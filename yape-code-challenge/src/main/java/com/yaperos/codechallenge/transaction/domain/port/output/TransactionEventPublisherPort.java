package com.yaperos.codechallenge.transaction.domain.port.output;

import com.yaperos.codechallenge.transaction.domain.model.Transaction;

public interface TransactionEventPublisherPort {

    void publishTransactionCreated(Transaction transaction);

}
