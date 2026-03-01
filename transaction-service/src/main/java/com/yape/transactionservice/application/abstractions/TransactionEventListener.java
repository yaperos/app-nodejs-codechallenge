package com.yape.transactionservice.application.abstractions;

import com.yape.transactionservice.domain.models.Transaction;

public interface TransactionEventListener {

    void onTransactionStatusUpdated(Transaction transaction);

}
