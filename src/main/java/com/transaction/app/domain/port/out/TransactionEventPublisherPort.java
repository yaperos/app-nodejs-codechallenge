package com.transaction.app.domain.port.out;

import com.transaction.app.domain.model.TransactionModel;

public interface TransactionEventPublisherPort {
    void publish(TransactionModel model);
}
